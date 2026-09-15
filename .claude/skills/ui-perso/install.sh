#!/usr/bin/env bash
# Rend ce catalogue disponible dans TOUS vos projets, sur cette machine.
#
# Cree un lien symbolique ~/.claude/skills/ui-perso -> ce dossier.
# Le lien, pas une copie : vous editez les CSV ici, vous commitez ici, et
# c'est a jour partout immediatement. Une copie divergerait au premier ajout.
#
#   ./install.sh            installe (ou repare) le lien
#   ./install.sh --status   dit ou on en est, ne touche a rien
#   ./install.sh --remove   retire le lien
#
set -euo pipefail

SOURCE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILLS_DIR="${CLAUDE_SKILLS_DIR:-$HOME/.claude/skills}"
TARGET="$SKILLS_DIR/ui-perso"

status() {
  if [ -L "$TARGET" ]; then
    local dest
    dest="$(readlink "$TARGET")"
    if [ "$dest" = "$SOURCE" ]; then
      echo "OK   $TARGET -> $SOURCE"
    else
      echo "DIFF $TARGET -> $dest"
      echo "     (ce dossier-ci est $SOURCE — relancer ./install.sh pour repointer)"
    fi
  elif [ -e "$TARGET" ]; then
    echo "OCCUPE $TARGET existe et n'est pas un lien symbolique."
    echo "       Le deplacer ou le supprimer avant d'installer."
  else
    echo "ABSENT $TARGET n'existe pas. Lancer ./install.sh"
  fi
}

remove() {
  if [ -L "$TARGET" ]; then
    rm "$TARGET"
    echo "Lien retire : $TARGET"
  else
    echo "Rien a retirer : $TARGET n'est pas un lien symbolique."
  fi
}

install() {
  mkdir -p "$SKILLS_DIR"
  if [ -e "$TARGET" ] && [ ! -L "$TARGET" ]; then
    echo "Refus : $TARGET existe et n'est pas un lien symbolique." >&2
    echo "Le deplacer ou le supprimer d'abord — je ne touche pas a un vrai dossier." >&2
    exit 1
  fi
  ln -sfn "$SOURCE" "$TARGET"
  echo "Installe : $TARGET -> $SOURCE"
  echo
  echo "Verification :"
  python3 "$TARGET/scripts/search.py" --list | head -2
  echo
  echo "Le skill sera charge au prochain demarrage de Claude Code."
}

case "${1:-}" in
  --status) status ;;
  --remove) remove ;;
  "")       install ;;
  *)        echo "Usage: $0 [--status|--remove]" >&2; exit 2 ;;
esac
