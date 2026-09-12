import re
import os

# Read base structure from charente_seniors.html
with open("charente_seniors.html", "r", encoding="utf-8") as f:
    seniors_content = f.read()

# Extract header (up to <section id="experiences" class="section">)
header_match = re.search(r"(.*?)<section id=\"experiences\" class=\"section\">", seniors_content, re.DOTALL)
header = header_match.group(1) if header_match else ""
header = header.replace("<title>Elya Prugnieres | Salon des Séniors - Charente Libre</title>", "<title>Elya Prugnieres | Vidéo Salon - Charente Libre</title>")

# Extract footer
footer_match = re.search(r"(<div class=\"project-nav-footer\">.*)", seniors_content, re.DOTALL)
footer = footer_match.group(1) if footer_match else ""

# Read charente.html to extract Facebook Stats circles
with open("charente.html", "r", encoding="utf-8") as f:
    charente_content = f.read()

stats_match = re.search(r"(<div class=\"facebook-stats-section\".*?</div>\s*</div>\s*</div>)", charente_content, re.DOTALL)
stats_circles = stats_match.group(1) if stats_match else ""

# Remove stats circles from charente.html
if stats_circles:
    charente_content = charente_content.replace(stats_circles, "")
    
# Update link in charente.html
# Look for <a href="charente_seniors.html" ... > before the video element
# Actually, the easiest way is to use regex specifically for the videos block
pattern = r'(<a href="charente_seniors.html"[^>]*>\s*<video[^>]*id="fb-video")'
replacement = r'<a href="charente_video.html" class="charente-media-wrapper" style="text-decoration: none;">\n                                <video preload="none" data-autoplay="true" id="fb-video"'
charente_content = re.sub(pattern, replacement, charente_content)

with open("charente.html", "w", encoding="utf-8") as f:
    f.write(charente_content)

print("Updated charente.html")

# Construct charente_video.html
video_page_content = f"""{header}
    <!-- Project Detail Section -->
    <section id="experiences" class="section">
        <div class="container text-center">
            <div style="max-width: 1000px; margin: 0 auto; text-align: left; padding-top: 2rem;">
                <a href="charente.html" class="back-btn">
                    <i class="fas fa-arrow-left"></i> Retour
                </a>
            </div>

            <h2 class="project-detail-title">VIDEO SALON</h2>

            <!-- Section 1: Top Video -->
            <div class="container" style="max-width: 1200px; margin: 0 auto; text-align: center;">
                <div style="border-radius: 12px; overflow: hidden; box-shadow: 0 8px 30px rgba(0,0,0,0.15); margin-bottom: 2rem; background: #000;">
                    <video controls autoplay loop muted style="width: 100%; max-height: 80vh; display: block;">
                        <source src="assets/Venez rencontrer V2.mp4" type="video/mp4">
                        Votre navigateur ne supporte pas la balise vidéo.
                    </video>
                </div>
                
                <div style="max-width: 800px; margin: 0 auto 5rem auto; background: #fff; padding: 2.5rem; border-radius: 12px; box-shadow: 0 5px 20px rgba(0,0,0,0.05); text-align: left;">
                    <h4 style="font-family: var(--font-heading); color: #523928; font-size: 1.5rem; margin-bottom: 1rem; text-transform: uppercase;">À propos de la vidéo</h4>
                    <p class="corpus" style="font-size: 1.1rem; line-height: 1.8; color: #444; margin-bottom: 0;">
                        Cette vidéo a été conçue pour promouvoir le <strong>Salon des Séniors</strong> de manière dynamique et engageante. L'objectif était de capter l'attention sur les réseaux sociaux et de mettre en valeur les différents univers présents lors de l'événement. Le montage rythmé permet de donner un aperçu vivant de l'ambiance du salon.
                    </p>
                </div>
            </div>

            <!-- Section 2: Stats Circles -->
            <div class="container" style="max-width: 1200px; margin: 0 auto;">
                {stats_circles}
                
                <div style="max-width: 800px; margin: 3rem auto 5rem auto; background: #fff; padding: 2.5rem; border-radius: 12px; box-shadow: 0 5px 20px rgba(0,0,0,0.05); text-align: left;">
                    <h4 style="font-family: var(--font-heading); color: #523928; font-size: 1.5rem; margin-bottom: 1rem; text-transform: uppercase;">Détails des performances</h4>
                    <p class="corpus" style="font-size: 1.1rem; line-height: 1.8; color: #444; margin-bottom: 0;">
                        Ces statistiques démontrent l'efficacité de notre stratégie digitale. Avec <strong>71 000 vues générées en seulement 15 jours</strong>, la campagne a atteint une portée massive sur le territoire charentais. De plus, le fait que <strong>20% des visiteurs</strong> se soient déplacés spécifiquement suite à nos publications Facebook confirme le taux de conversion élevé de ce format vidéo.
                    </p>
                </div>
            </div>

            <!-- Section 3: Future Video Placeholder -->
            <div class="container" style="max-width: 1200px; margin: 0 auto; text-align: center; border-top: 1px dashed rgba(82, 57, 40, 0.15); padding-top: 4rem;">
                <h3 style="font-family: var(--font-heading); color: var(--primary-color); font-size: 2rem; margin-bottom: 3rem; text-transform: uppercase;">
                    À venir...
                </h3>
                
                <div style="width: 100%; aspect-ratio: 16/9; background: #eee; border: 2px dashed #ccc; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-bottom: 2rem;">
                    <p style="font-size: 1.2rem; color: #888; font-family: var(--font-main);">[ Espace réservé pour la dernière vidéo ]</p>
                </div>
            </div>
            
        </div>
    </section>

{footer}"""

with open("charente_video.html", "w", encoding="utf-8") as f:
    f.write(video_page_content)

print("Created charente_video.html")
