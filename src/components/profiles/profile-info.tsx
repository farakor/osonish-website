'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, GraduationCap } from "lucide-react";
import type { WorkExperience, Education } from "@/types";
import { useTranslations } from 'next-intl';

interface ProfileInfoProps {
  education?: Education[];
  workExperience?: WorkExperience[];
  skills?: string[];
  aboutMe?: string;
  willingToRelocate?: boolean;
  desiredSalary?: number;
}

export function ProfileInfo({
  education,
  workExperience,
  skills,
  aboutMe,
  willingToRelocate,
  desiredSalary,
}: ProfileInfoProps) {
  const t = useTranslations('profilePage');
  
  // Проверяем что массивы действительно массивы
  const safeSkills = Array.isArray(skills) ? skills : [];
  const safeWorkExperience = Array.isArray(workExperience) ? workExperience : [];
  const safeEducation = Array.isArray(education) ? education : [];

  // Логируем для отладки
  console.log('ProfileInfo received:', {
    workExperience,
    safeWorkExperience,
    workExperienceLength: safeWorkExperience.length,
    education,
    safeEducation,
    educationLength: safeEducation.length,
  });

  return (
    <div className="space-y-6">
      {/* Skills */}
      {safeSkills.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{t('skills')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {safeSkills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Work Experience */}
      {safeWorkExperience.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              {t('workExperience')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {safeWorkExperience.map((exp, index) => (
              <div key={index} className="border-l-2 border-primary pl-4">
                <h3 className="font-semibold">{exp.position}</h3>
                <p className="text-sm text-muted-foreground">{exp.company}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {exp.yearStart} - {exp.yearEnd || t('present')}
                </p>
                {exp.description && (
                  <p className="text-sm mt-2">{exp.description}</p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Education */}
      {safeEducation.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              {t('education')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {safeEducation.map((edu, index) => (
              <div key={index} className="border-l-2 border-primary pl-4">
                <h3 className="font-semibold">{edu.institution}</h3>
                {edu.degree && (
                  <p className="text-sm text-muted-foreground">{edu.degree}</p>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  {edu.yearStart} - {edu.yearEnd || t('present')}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

