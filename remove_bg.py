from PIL import Image
import sys
import glob
import os

def process_image(img_path):
    # Open image
    img = Image.open(img_path).convert("RGBA")
    data = list(img.getdata())
    width, height = img.size
    
    # We want to flood-fill the background starting from (0,0) and the other corners.
    # The checkerboard consists of two colors. Usually white (255,255,255) and gray (204,204,204) or similar.
    # First, let's normalize the background by changing the gray checks to white, 
    # so we have a solid white background.
    # The dark brown lines are around (93,64,55) or similar.
    
    # Let's find the exact checkerboard colors from the top left corner pixels
    corners = [(0,0), (width-1, 0), (0, height-1), (width-1, height-1)]
    bg_colors = set()
    for x in range(20):
        for y in range(20):
            bg_colors.add(img.getpixel((x,y))[:3])
            
    # Typically fake transparency has 2 colors. Let's just find pixels that are "close" to white or light gray,
    # and not close to brown.
    # Brown is #5D4037 -> (93, 64, 55). Let's say if redness > 150, it's not brown.
    # Actually, the prompt was brown outline, white fill.
    # Let's just do a BFS floodfill from corners, treating any pixel that is NOT brown as fillable.
    
    def is_brown(pixel):
        r, g, b, a = pixel
        # Brown is dark and reddish.
        # Let's use a simple luminance threshold.
        # If the pixel is dark enough, it's the outline.
        luminance = 0.299*r + 0.587*g + 0.114*b
        return luminance < 180 # Checkboard is light, white is 255. Brown is < 100.
    
    visited = set()
    queue = []
    
    for c in corners:
        if not is_brown(img.getpixel(c)):
            queue.append(c)
            visited.add(c)
            
    # Flood fill
    pixel_access = img.load()
    while queue:
        cx, cy = queue.pop(0)
        # Set to transparent
        pixel_access[cx, cy] = (255, 255, 255, 0)
        
        # Check neighbors
        for dx, dy in [(-1,0), (1,0), (0,-1), (0,1)]:
            nx, ny = cx + dx, cy + dy
            if 0 <= nx < width and 0 <= ny < height:
                if (nx, ny) not in visited:
                    visited.add((nx, ny))
                    if not is_brown(pixel_access[nx, ny]):
                        queue.append((nx, ny))
                        
    # Overwrite image
    img.save(img_path)
    print(f"Processed {img_path}")

files = glob.glob("/Users/elya/Documents/ANTIGRAVITY/Portfolio/assets/horse_scrolly/horse_*_wb_*.png")
for f in files:
    process_image(f)
