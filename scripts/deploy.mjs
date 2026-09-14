/**
 * Publie dist/ sur la branche gh-pages, que GitHub Pages sert telle quelle.
 * À lancer via `npm run deploy` (qui reconstruit d'abord le site).
 *
 * La branche ne garde qu'un seul commit : c'est un produit de construction,
 * l'historique vit sur main. L'authentification passe par `gh` s'il est
 * connecté, sinon par les identifiants git habituels.
 */
import { execFileSync } from "node:child_process";
import { rmSync, writeFileSync } from "node:fs";

const git = (args, cwd = ".") =>
  execFileSync("git", args, { cwd, stdio: ["ignore", "pipe", "inherit"] }).toString().trim();

const remote = git(["remote", "get-url", "origin"]);
const name = git(["config", "user.name"]);
const email = git(["config", "user.email"]);

let auth = [];
try {
  execFileSync("gh", ["auth", "status"], { stdio: "ignore" });
  auth = ["-c", "credential.helper=", "-c", "credential.helper=!gh auth git-credential"];
} catch {
  // Pas de gh : git se débrouille avec ses propres identifiants.
}

// Sans ce fichier, Pages ferait passer le site par Jekyll.
writeFileSync("dist/.nojekyll", "");

try {
  git(["init", "-q", "-b", "gh-pages"], "dist");
  git(["add", "-A"], "dist");
  git(["-c", `user.name=${name}`, "-c", `user.email=${email}`, "commit", "-q", "-m", "Publication du site"], "dist");
  execFileSync("git", [...auth, "push", "-q", "-f", remote, "gh-pages"], { cwd: "dist", stdio: "inherit" });
  console.log("Site publié : https://pierrepommiers69400.github.io/urban-key/ (en ligne d'ici une minute)");
} finally {
  rmSync("dist/.git", { recursive: true, force: true });
}
