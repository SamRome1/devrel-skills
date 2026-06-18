import { UploadForm } from "../_components/UploadForm";

export const metadata = { title: "Share a skill — Skills Library" };

export default function UploadPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-semibold tracking-tight">Share a skill</h1>
      <p className="mt-1.5 text-sm text-dim">
        Upload a Claude skill folder (the directory containing its{" "}
        <code>SKILL.md</code>) or a <code>.zip</code> of it. The name and
        description are read straight from the <code>SKILL.md</code>{" "}
        frontmatter.
      </p>
      <div className="mt-6">
        <UploadForm />
      </div>
    </div>
  );
}
