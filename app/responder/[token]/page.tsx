import { SurveyClient } from "./SurveyClient";

interface PageProps {
  params: Promise<{ token: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { token } = await params;
  return {
    title: "Encuesta de Satisfacción — Survey Elite",
    description: "Comparte tu experiencia y ayúdanos a mejorar. Tu opinión es muy importante.",
    robots: "noindex, nofollow",
    openGraph: {
      title: "Encuesta de Satisfacción",
      description: "Tu opinión nos ayuda a mejorar la experiencia.",
    },
  };
}

export default async function ResponderPage({ params }: PageProps) {
  const { token } = await params;

  return <SurveyClient token={token} />;
}
