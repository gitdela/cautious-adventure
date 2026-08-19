import { permanentRedirect } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

export default async function LegacyNewsArticlePage({ params }: Props) {
  const { slug } = await params;
  permanentRedirect(`/blog/${slug}`);
}
