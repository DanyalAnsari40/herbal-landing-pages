from PIL import Image

def remove_white_bg(input_path, output_path):
    img = Image.open(input_path)
    img = img.convert("RGBA")
    data = img.getdata()
    newData = []
    
    # Tolerance for "white"
    threshold = 230
    
    for item in data:
        # item is (R, G, B, A)
        if item[0] > threshold and item[1] > threshold and item[2] > threshold:
            # Change white (also close to white) to transparent
            newData.append((255, 255, 255, 0))
        else:
            newData.append(item)
            
    img.putdata(newData)
    img.save(output_path, "PNG")

if __name__ == "__main__":
    input_paths = [
        r"c:\Users\danya\OneDrive\Desktop\herbal-landing-pages\High Power-1\images\High Power.jpeg",
        r"c:\Users\danya\OneDrive\Desktop\herbal-landing-pages\High Power-2\images\High Power.jpeg",
        r"c:\Users\danya\OneDrive\Desktop\herbal-landing-pages\High Power-3\images\High Power.jpeg",
        r"c:\Users\danya\OneDrive\Desktop\herbal-landing-pages\High Power-4\images\High Power.jpeg"
    ]
    output_names = [
        r"c:\Users\danya\OneDrive\Desktop\herbal-landing-pages\High Power-1\images\High Power.png",
        r"c:\Users\danya\OneDrive\Desktop\herbal-landing-pages\High Power-2\images\High Power.png",
        r"c:\Users\danya\OneDrive\Desktop\herbal-landing-pages\High Power-3\images\High Power.png",
        r"c:\Users\danya\OneDrive\Desktop\herbal-landing-pages\High Power-4\images\High Power.png"
    ]
    for i, o in zip(input_paths, output_names):
        try:
            remove_white_bg(i, o)
            print(f"Processed {o}")
        except Exception as e:
            print(f"Failed {i}: {e}")
