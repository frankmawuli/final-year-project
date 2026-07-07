"use client";

import { useState } from "react";
import { FileText, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CertificateUploadForm,
  type CertificateEntry,
} from "@/components/jobs/profile/certificate-upload-form";

interface CertificateRecord extends CertificateEntry {
  id: string;
  previewUrl: string;
}

export function CertificatesAwardsTab() {
  const [adding, setAdding] = useState(false);
  const [certificates, setCertificates] = useState<CertificateRecord[]>([]);

  function handleSave(entry: CertificateEntry) {
    setCertificates((prev) => [
      ...prev,
      { ...entry, id: crypto.randomUUID(), previewUrl: URL.createObjectURL(entry.file) },
    ]);
    setAdding(false);
  }

  function handleRemove(id: string) {
    setCertificates((prev) => {
      const target = prev.find((cert) => cert.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((cert) => cert.id !== id);
    });
  }

  if (adding) {
    return (
      <div className="bg-white rounded-b-xl border border-[#E5E7EB]">
        <CertificateUploadForm onCancel={() => setAdding(false)} onSave={handleSave} />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-b-xl border border-[#E5E7EB]">
      <div className="px-5 py-5">
        <h3 className="text-[15px] font-semibold text-foreground">Certificates & Awards</h3>
        <p className="mt-1 text-[13px] text-muted-foreground leading-relaxed">
          Add certifications, licenses, or awards you&apos;ve earned, along with a copy of the
          certificate (PDF or image).
        </p>

        {certificates.length > 0 && (
          <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {certificates.map((cert) => (
              <div
                key={cert.id}
                className="flex items-start gap-2.5 rounded-xl border border-[#E5E7EB] p-3"
              >
                {cert.file.type.startsWith("image/") ? (
                  <img
                    src={cert.previewUrl}
                    alt={cert.title}
                    className="h-12 w-12 shrink-0 rounded-lg object-cover"
                  />
                ) : (
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                    <FileText className="size-5" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13.5px] font-semibold text-foreground">{cert.title}</p>
                  <p className="truncate text-[12.5px] text-muted-foreground">{cert.issuer}</p>
                  {cert.issueMonth && cert.issueYear && (
                    <p className="mt-0.5 text-[12px] text-muted-foreground">
                      Issued {cert.issueMonth} {cert.issueYear}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  aria-label="Remove certificate"
                  onClick={() => handleRemove(cert.id)}
                  className="shrink-0 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="mt-5 flex justify-center">
          <Button size="sm" className="rounded-full px-3" onClick={() => setAdding(true)}>
            <Plus className="size-3.5" />
            Add
          </Button>
        </div>
      </div>
    </div>
  );
}
