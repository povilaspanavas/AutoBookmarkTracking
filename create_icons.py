from PIL import Image, ImageDraw, ImageFont
import os

# Create simple bookmark icon
def create_icon(size):
    # Create image with transparent background
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Calculate proportions
    margin = size // 8
    bookmark_width = size - 2 * margin
    bookmark_height = int(size * 0.7)
    
    # Draw bookmark shape (rectangle with triangle cut at bottom)
    points = [
        (margin, margin),  # Top left
        (size - margin, margin),  # Top right
        (size - margin, bookmark_height),  # Bottom right outer
        (size // 2, bookmark_height - size // 6),  # Bottom center (triangle point)
        (margin, bookmark_height),  # Bottom left outer
    ]
    
    # Fill bookmark with blue gradient effect
    draw.polygon(points, fill=(74, 144, 226, 255), outline=(50, 100, 180, 255))
    
    # Add a simple "A" or checkmark if size is large enough
    if size >= 48:
        # Draw a simple checkmark
        check_points = [
            (size // 3, size // 2),
            (size // 2.2, size // 1.7),
            (size // 1.5, size // 3)
        ]
        draw.line(check_points, fill='white', width=max(2, size // 20))
    
    return img

# Create icons in different sizes
for size in [16, 48, 128]:
    icon = create_icon(size)
    icon.save(f'icon{size}.png')
    print(f'Created icon{size}.png')

print('All icons created successfully!')
