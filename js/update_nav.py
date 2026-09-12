import os
import re

directory = "/Users/elya/Documents/Documents - MacBook Air de Elya/ANTIGRAVITY/Portfolio"
exclude_files = {"index.html", "about.html", "parcours.html", "skills.html", "photos.html", "contact.html"}

new_navbar = """    <!-- Navigation -->
    <nav class="navbar">
        <div class="nav-links">
            <a href="index.html">Accueil</a>
            <a href="about.html">About me</a>
            <a href="parcours.html">Parcours</a>
            <a href="skills.html">Compétences</a>
            <a href="photos.html">Mes Photos</a>
            <div class="nav-dropdown">
                <span class="nav-dropdown-toggle">Mes Expériences</span>
                <div class="nav-dropdown-menu">
                    <a href="charente.html">Charente Libre</a>
                    <a href="corderie.html">Corderie Royale</a>
                    <a href="adresse.html">Groupe Adresse : Service Civique</a>
                </div>
            </div>
            <div class="nav-dropdown">
                <span class="nav-dropdown-toggle">Mes Projets</span>
                <div class="nav-dropdown-menu">
                    <a href="antares.html">Antares - Campagne fictive</a>
                    <a href="antilles.html">Les Antilles de Jonzac - Campagne fictive</a>
                    <a href="spa.html">La SPA - Campagne fictive</a>
                    <a href="cgr.html">CGR Cinéma - Campagne fictive</a>
                    <a href="aquarium.html">Aquarium de La Rochelle - Campagne Fictive</a>
                    <a href="interim.html">Espace Interim - Flyers Réseaux Sociaux</a>
                    <a href="hopital.html">Hopital des 15-20 - Exercice graphique</a>
                    <a href="koel.html">Centre Koel - Exercice pratique</a>
                </div>
            </div>
            <a href="contact.html">Contact</a>
        </div>
    </nav>"""

# We'll use a regex that matches the navbar from <!-- Navigation --> or <nav class="navbar"> to </nav>
navbar_pattern = re.compile(r'(<!--\s*Navigation\s*-->\s*)?<nav class="navbar">.*?</nav>', re.DOTALL)

updated_count = 0
for filename in os.listdir(directory):
    if filename.endswith(".html") and filename not in exclude_files:
        filepath = os.path.join(directory, filename)
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()
        
        if navbar_pattern.search(content):
            new_content = navbar_pattern.sub(new_navbar, content)
            with open(filepath, "w", encoding="utf-8") as f:
                f.write(new_content)
            print(f"Updated navbar in {filename}")
            updated_count += 1
        else:
            # Fallback if there is no <!-- Navigation --> comment but there is <nav class="navbar">
            print(f"Navbar tag not found or mismatched in {filename}")

print(f"Finished updating {updated_count} files.")
