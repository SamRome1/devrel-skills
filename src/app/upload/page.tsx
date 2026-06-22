import { UploadForm } from "../_components/UploadForm";

export const metadata = { title: "Share a skill — Skills Library" };

export default function UploadPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-semibold tracking-tight">Share a skill</h1>
      <p className="mt-1.5 text-sm text-dim">
        Fill this in and we&apos;ll open a prefilled pull request against the
        library repo — the repo is the source of truth. Already have a{" "}
        <code>SKILL.md</code>? Load it below to populate the form.
      </p>
      <div className="mt-6">
        <UploadForm />
      </div>
    </div>
  );
}
