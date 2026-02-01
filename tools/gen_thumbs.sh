#!/bin/bash
# Generate thumbnails for all photos
PHOTOS_DIR="${1:-../photos}"
THUMB_SIZE=400

find "$PHOTOS_DIR" -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" \) | while read f; do
  dir=$(dirname "$f")
  base=$(basename "$f" | sed 's/\.[^.]*$//')
  ext="${f##*.}"
  thumb="${dir}/${base}_thumb.${ext}"
  
  if [ ! -f "$thumb" ]; then
    echo "Creating thumbnail: $thumb"
    sips -Z $THUMB_SIZE "$f" --out "$thumb" 2>/dev/null
  fi
done
echo "Done!"
