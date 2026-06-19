#!/bin/bash

# Image Optimization Script
# Purpose: Extract base64 images, optimize PNG/JPG, convert to WebP
# Usage: See --help for full usage information

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Script version
VERSION="1.0.0"

# Default settings
WEBP_QUALITY=80
PNG_QUALITY=85
JPG_QUALITY=85
OUTPUT_DIR="src/assets/images/extracted"

# Help message
show_help() {
    cat << EOF
Image Optimization Script v${VERSION}

USAGE:
    ./scripts/optimize-images.sh <command> [options] <input>

COMMANDS:
    extract <file>          Extract base64 images from HTML/Nunjucks file
    optimize <dir>          Optimize PNG/JPG images in directory
    convert <dir>           Convert images to WebP format
    all <file> <output>     Extract, optimize, and convert in one step
    help                    Show this help message

OPTIONS:
    --webp-quality <n>      WebP quality (0-100, default: 80)
    --png-quality <n>       PNG quality (0-100, default: 85)
    --jpg-quality <n>       JPG quality (0-100, default: 85)
    --output <dir>          Output directory (default: ${OUTPUT_DIR})

EXAMPLES:
    # Extract base64 images from about page
    ./scripts/optimize-images.sh extract src/pages/about.njk

    # Optimize all images in directory
    ./scripts/optimize-images.sh optimize src/assets/images/experts/

    # Convert images to WebP
    ./scripts/optimize-images.sh convert src/assets/images/experts/

    # Full workflow: extract, optimize, convert
    ./scripts/optimize-images.sh all src/pages/about.njk src/assets/images/experts/

REQUIREMENTS:
    - base64 (usually pre-installed)
    - pngquant (brew install pngquant)
    - jpegoptim (brew install jpegoptim)
    - webp (brew install webp)

NOTES:
    - Original files are preserved (new files created with suffixes)
    - WebP conversion creates .webp alongside original
    - Progress and file sizes reported for each operation

EOF
}

# Print colored message
print_message() {
    local color=$1
    shift
    echo -e "${color}$@${NC}"
}

# Print section header
print_header() {
    echo ""
    print_message "${BLUE}" "═══════════════════════════════════════════════════════"
    print_message "${BLUE}" "$@"
    print_message "${BLUE}" "═══════════════════════════════════════════════════════"
    echo ""
}

# Print success message
print_success() {
    print_message "${GREEN}" "✓ $@"
}

# Print error message
print_error() {
    print_message "${RED}" "✗ $@"
}

# Print warning message
print_warning() {
    print_message "${YELLOW}" "⚠ $@"
}

# Print info message
print_info() {
    print_message "${NC}" "ℹ $@"
}

# Check if required tools are installed
check_requirements() {
    local missing_tools=()

    if ! command -v base64 &> /dev/null; then
        missing_tools+=("base64")
    fi

    if ! command -v pngquant &> /dev/null; then
        missing_tools+=("pngquant")
    fi

    if ! command -v jpegoptim &> /dev/null; then
        missing_tools+=("jpegoptim")
    fi

    if ! command -v cwebp &> /dev/null; then
        missing_tools+=("cwebp (webp)")
    fi

    if [ ${#missing_tools[@]} -gt 0 ]; then
        print_error "Missing required tools:"
        for tool in "${missing_tools[@]}"; do
            echo "  - $tool"
        done
        echo ""
        print_info "Install missing tools:"
        echo "  brew install pngquant jpegoptim webp"
        exit 1
    fi
}

# Get file size in human-readable format
get_file_size() {
    local file=$1
    if [ -f "$file" ]; then
        if [[ "$OSTYPE" == "darwin"* ]]; then
            # macOS
            stat -f "%z" "$file"
        else
            # Linux
            stat -c "%s" "$file"
        fi
    else
        echo "0"
    fi
}

# Format bytes to human readable
format_bytes() {
    local bytes=$1
    if [ $bytes -lt 1024 ]; then
        echo "${bytes}B"
    elif [ $bytes -lt 1048576 ]; then
        echo "$(( bytes / 1024 ))KB"
    else
        echo "$(( bytes / 1048576 ))MB"
    fi
}

# Extract base64 images from HTML/Nunjucks file
extract_images() {
    local input_file=$1
    local output_dir=$2

    print_header "Extracting Base64 Images"

    if [ ! -f "$input_file" ]; then
        print_error "Input file not found: $input_file"
        exit 1
    fi

    mkdir -p "$output_dir"

    # Extract base64 images using grep and sed
    local image_count=0
    local total_size=0

    # Find all base64 image tags
    while IFS= read -r line; do
        # Extract image type (png, jpg, jpeg, gif, webp)
        local img_type=$(echo "$line" | grep -o 'data:image/[^;]*' | sed 's/data:image\///')

        # Extract base64 data (everything after 'base64,')
        local base64_data=$(echo "$line" | sed 's/.*base64,//' | sed 's/".*//')

        if [ -n "$base64_data" ]; then
            ((image_count++))

            local filename=$(printf "image-%03d.%s" $image_count "$img_type")
            local output_file="$output_dir/$filename"

            # Decode base64 to file
            echo "$base64_data" | base64 --decode > "$output_file"

            local file_size=$(get_file_size "$output_file")
            total_size=$((total_size + file_size))

            print_success "Extracted: $filename ($(format_bytes $file_size))"
        fi
    done < <(grep -o 'data:image/[^"]*' "$input_file")

    echo ""
    print_info "Total images extracted: $image_count"
    print_info "Total size: $(format_bytes $total_size)"
    print_info "Output directory: $output_dir"
}

# Optimize PNG images with pngquant
optimize_png() {
    local dir=$1
    local quality=$2

    print_header "Optimizing PNG Images"

    local png_files=("$dir"/*.png)

    if [ ! -e "${png_files[0]}" ]; then
        print_warning "No PNG files found in $dir"
        return
    fi

    local total_original=0
    local total_optimized=0
    local file_count=0

    for file in "${png_files[@]}"; do
        if [ -f "$file" ]; then
            local original_size=$(get_file_size "$file")
            total_original=$((total_original + original_size))

            # Create optimized version
            local output_file="${file%.png}-optimized.png"

            pngquant --quality=${quality}-${quality} "$file" -o "$output_file" --force 2>/dev/null

            if [ -f "$output_file" ]; then
                local optimized_size=$(get_file_size "$output_file")
                total_optimized=$((total_optimized + optimized_size))

                local savings=$((original_size - optimized_size))
                local percent=$((savings * 100 / original_size))

                print_success "$(basename "$file"): $(format_bytes $original_size) → $(format_bytes $optimized_size) (-${percent}%)"

                ((file_count++))
            else
                print_warning "Failed to optimize: $(basename "$file")"
            fi
        fi
    done

    if [ $file_count -gt 0 ]; then
        local total_savings=$((total_original - total_optimized))
        local total_percent=$((total_savings * 100 / total_original))

        echo ""
        print_info "Files optimized: $file_count"
        print_info "Total savings: $(format_bytes $total_savings) (-${total_percent}%)"
    fi
}

# Optimize JPG images with jpegoptim
optimize_jpg() {
    local dir=$1
    local quality=$2

    print_header "Optimizing JPG Images"

    local jpg_files=("$dir"/*.jpg "$dir"/*.jpeg)
    local found_files=()

    # Filter out non-existent files
    for file in "${jpg_files[@]}"; do
        if [ -f "$file" ]; then
            found_files+=("$file")
        fi
    done

    if [ ${#found_files[@]} -eq 0 ]; then
        print_warning "No JPG files found in $dir"
        return
    fi

    local total_original=0
    local total_optimized=0
    local file_count=0

    for file in "${found_files[@]}"; do
        local original_size=$(get_file_size "$file")
        total_original=$((total_original + original_size))

        # Create copy for optimization
        local output_file="${file%.*}-optimized.${file##*.}"
        cp "$file" "$output_file"

        # Optimize in-place
        jpegoptim --max=${quality} "$output_file" --quiet

        local optimized_size=$(get_file_size "$output_file")
        total_optimized=$((total_optimized + optimized_size))

        local savings=$((original_size - optimized_size))
        local percent=$((savings * 100 / original_size))

        print_success "$(basename "$file"): $(format_bytes $original_size) → $(format_bytes $optimized_size) (-${percent}%)"

        ((file_count++))
    done

    if [ $file_count -gt 0 ]; then
        local total_savings=$((total_original - total_optimized))
        local total_percent=$((total_savings * 100 / total_original))

        echo ""
        print_info "Files optimized: $file_count"
        print_info "Total savings: $(format_bytes $total_savings) (-${total_percent}%)"
    fi
}

# Convert images to WebP
convert_to_webp() {
    local dir=$1
    local quality=$2

    print_header "Converting Images to WebP"

    local image_files=("$dir"/*.png "$dir"/*.jpg "$dir"/*.jpeg)
    local found_files=()

    # Filter out non-existent files and already optimized files
    for file in "${image_files[@]}"; do
        if [ -f "$file" ] && [[ ! "$file" =~ -optimized\. ]]; then
            found_files+=("$file")
        fi
    done

    if [ ${#found_files[@]} -eq 0 ]; then
        print_warning "No PNG/JPG files found in $dir"
        return
    fi

    local total_original=0
    local total_webp=0
    local file_count=0

    for file in "${found_files[@]}"; do
        local original_size=$(get_file_size "$file")
        total_original=$((total_original + original_size))

        # Create WebP version
        local output_file="${file%.*}.webp"

        cwebp -q ${quality} "$file" -o "$output_file" -quiet 2>/dev/null

        if [ -f "$output_file" ]; then
            local webp_size=$(get_file_size "$output_file")
            total_webp=$((total_webp + webp_size))

            local savings=$((original_size - webp_size))
            local percent=$((savings * 100 / original_size))

            print_success "$(basename "$file"): $(format_bytes $original_size) → $(format_bytes $webp_size) (-${percent}%)"

            ((file_count++))
        else
            print_warning "Failed to convert: $(basename "$file")"
        fi
    done

    if [ $file_count -gt 0 ]; then
        local total_savings=$((total_original - total_webp))
        local total_percent=$((total_savings * 100 / total_original))

        echo ""
        print_info "Files converted: $file_count"
        print_info "Total savings: $(format_bytes $total_savings) (-${total_percent}%)"
    fi
}

# Main function
main() {
    local command=$1
    shift

    # Parse options
    while [[ $# -gt 0 ]]; do
        case $1 in
            --webp-quality)
                WEBP_QUALITY=$2
                shift 2
                ;;
            --png-quality)
                PNG_QUALITY=$2
                shift 2
                ;;
            --jpg-quality)
                JPG_QUALITY=$2
                shift 2
                ;;
            --output)
                OUTPUT_DIR=$2
                shift 2
                ;;
            *)
                break
                ;;
        esac
    done

    case $command in
        extract)
            check_requirements
            if [ -z "$1" ]; then
                print_error "Missing input file"
                echo "Usage: $0 extract <file>"
                exit 1
            fi
            extract_images "$1" "$OUTPUT_DIR"
            ;;

        optimize)
            check_requirements
            if [ -z "$1" ]; then
                print_error "Missing directory"
                echo "Usage: $0 optimize <dir>"
                exit 1
            fi
            optimize_png "$1" "$PNG_QUALITY"
            optimize_jpg "$1" "$JPG_QUALITY"
            ;;

        convert)
            check_requirements
            if [ -z "$1" ]; then
                print_error "Missing directory"
                echo "Usage: $0 convert <dir>"
                exit 1
            fi
            convert_to_webp "$1" "$WEBP_QUALITY"
            ;;

        all)
            check_requirements
            if [ -z "$1" ] || [ -z "$2" ]; then
                print_error "Missing arguments"
                echo "Usage: $0 all <input_file> <output_dir>"
                exit 1
            fi
            extract_images "$1" "$2"
            optimize_png "$2" "$PNG_QUALITY"
            optimize_jpg "$2" "$JPG_QUALITY"
            convert_to_webp "$2" "$WEBP_QUALITY"
            print_header "Complete!"
            print_success "All images extracted, optimized, and converted"
            ;;

        help|--help|-h)
            show_help
            ;;

        *)
            print_error "Unknown command: $command"
            echo ""
            show_help
            exit 1
            ;;
    esac
}

# Run main function
main "$@"
