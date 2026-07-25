import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EditorialPage } from "../../components/EditorialPage";
import { editorialPages } from "../../data/pages";

export function generateStaticParams() { return Object.keys(editorialPages).map((page) => ({ page })); }
export async function generateMetadata({ params }: { params: Promise<{ page: string }> }): Promise<Metadata> { const { page: slug } = await params; const page = editorialPages[slug]; return page ? { title: page.eyebrow, description: page.description, alternates: { canonical: `/${slug}` } } : {}; }
export default async function InfoPage({ params }: { params: Promise<{ page: string }> }) { const { page: slug } = await params; const page = editorialPages[slug]; if (!page) notFound(); return <EditorialPage page={page} slug={slug} />; }
