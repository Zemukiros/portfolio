export type EducationItem = {
  school: string;
  location: string;
  degree: string;
  detail?: string;
  dates: string;
};

export const education: EducationItem[] = [
  {
    school: "Bowie State University",
    location: "Bowie, MD",
    degree: "B.S. in Computer Science",
    detail: "GPA: 3.8 / 4.0",
    dates: "Expected May 2027",
  },
  {
    school: "Montgomery College",
    location: "Takoma Park, MD",
    degree: "A.S. in Computer Science",
    detail: "GPA: 3.7 / 4.0 · Dean's List · Phi Theta Kappa Honor Society",
    dates: "Dec 2025",
  },
];

export type Certification = {
  name: string;
  issuer: string;
  verifyUrl?: string;
};

export const certifications: Certification[] = [
  {
    name: "AWS Certified Solutions Architect – Associate",
    issuer: "Amazon Web Services",
    // verifyUrl: add Credly / AWS verification link when available
  },
];
