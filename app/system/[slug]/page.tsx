import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TechnicalPage } from "../../../components/TechnicalPage";
import { getSystemDetail, systemDetails } from "../../../data/system";

export function generateStaticParams() { return systemDetails.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params; const detail = getSystemDetail(slug);
  if (!detail) return {};
  return { title: detail.title, description: detail.summary, alternates: { canonical: `/system/${slug}` } };
}
export default async function DetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const detail = getSystemDetail(slug); if (!detail) notFound();
  return <TechnicalPage detail={detail} />;
}
