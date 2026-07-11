"use client";

import { Button } from "@/components/ui/button";
import { ProfileAvatar } from "@/components/jobs/profile/profile-avatar";
import { ProfileCompletionCard } from "@/components/jobs/profile/profile-completion-card";

export interface ProfileSidebarData {
  name: string;
  title: string;
  experience: string;
  availability: string;
  location: string;
  completionPercent: number;
  avatarUrl?: string;
}

export function ProfileSidebar({
  data,
  onUploadCv,
}: {
  data: ProfileSidebarData;
  onUploadCv?: () => void;
}) {
  return (
    <aside className="w-full shrink-0 md:w-[21.25rem]">
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="p-5 text-center">
          <ProfileAvatar alt={data.name} src={data.avatarUrl} />
          <h2 className="mt-3 text-base font-semibold text-foreground">{data.name}</h2>
          <p className="text-[13px] text-muted-foreground">{data.title}</p>

          <div className="mt-3 space-y-1">
            <div className="text-[13px] text-muted-foreground">
              Experience : <span className="font-semibold text-foreground">{data.experience}</span>
            </div>
            <div className="text-[13px] text-muted-foreground">
              Availability :{" "}
              <span className="font-semibold text-foreground">{data.availability}</span>
            </div>
            <div className="text-[13px] text-muted-foreground">
              Location: <span className="font-semibold text-foreground">{data.location}</span>
            </div>
          </div>
        </div>

        <div className="px-5">
          <ProfileCompletionCard percent={data.completionPercent} />
        </div>

        <div className="space-y-2 p-5">
          <Button className="w-full" size="lg" onClick={onUploadCv}>
            Upload CV & Cover Letter
          </Button>
          <Button variant="outline" className="w-full" size="lg">
            Build profile manually
          </Button>
        </div>
      </div>
    </aside>
  );
}
