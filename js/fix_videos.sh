#!/bin/bash

# Anti-Gravity Multimedia Optimization Skill
# Ce script convertit les fichiers MOV/MP4 en version optimisée pour le Web 
# avec conservation intégrale de la piste audio et encodage AAC/H.264.

if [ -z "$1" ]; then
    echo "Usage: ./fix_videos.sh <input_file>"
    exit 1
fi

INPUT_FILE="$1"
OUTPUT_FILE="${INPUT_FILE%.*}.mp4"

echo "🔄 Optimisation de $INPUT_FILE vers $OUTPUT_FILE..."

# Commande FFmpeg :
# -c:v libx264 : Force l'encodage vidéo H.264
# -crf 22 : Maintient une haute qualité (équilibre poids/qualité)
# -pix_fmt yuv420p : Assure la compatibilité Safari / QuickTime
# -c:a aac : Force l'encodage audio en AAC (universel)
# -b:a 192k : Bitrate audio haute fidélité
# -movflags +faststart : Permet de lire la vidéo avant le téléchargement complet
ffmpeg -i "$INPUT_FILE" \
    -c:v libx264 -crf 22 -pix_fmt yuv420p \
    -c:a aac -b:a 192k \
    -movflags +faststart \
    -y "$OUTPUT_FILE"

echo "✅ Terminé ! Nouveau fichier prêt pour le site : $OUTPUT_FILE"
