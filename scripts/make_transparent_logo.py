import os
from PIL import Image

def process_logos():
    # Load the crystal clear light logo with transparency
    light_png_path = r"c:\Users\PC USER\Desktop\Sh0p0\apps\web\public\logo-light.png"
    img = Image.open(light_png_path).convert("RGBA")
    
    # Create dark version by making the navy text white, keeping orange cart identical
    dark_img = Image.new("RGBA", img.size)
    data = img.get_flattened_data() if hasattr(img, "get_flattened_data") else img.getdata()
    
    new_data = []
    # Pixel by pixel
    for r, g, b, a in img.getdata():
        if a == 0:
            new_data.append((0, 0, 0, 0))
        else:
            # Check if pixel is part of the orange cart:
            # Orange has high red (r > 180) and low-to-medium green (g < 140) and low blue (b < 60)
            is_orange = (r > 160 and g < 140 and b < 80)
            if is_orange:
                new_data.append((r, g, b, a))
            else:
                # It's part of the dark navy text: change to crisp white
                new_data.append((255, 255, 255, a))
                
    dark_img.putdata(new_data)
    dark_output = r"c:\Users\PC USER\Desktop\Sh0p0\apps\web\public\logo-dark.png"
    dark_img.save(dark_output, "PNG", optimize=True)
    print(f"Saved pristine dark transparent logo to {dark_output}")

if __name__ == "__main__":
    process_logos()
