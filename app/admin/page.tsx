import { redirect } from "next/navigation";

/**
 * The old dashboard lived here. It was replaced by /admin/v2, so this
 * keeps existing bookmarks and muscle memory working instead of 404ing.
 * If v2 ever moves back to /admin, delete this file.
 */
export default function AdminIndex() {
  redirect("/admin/v2");
}
