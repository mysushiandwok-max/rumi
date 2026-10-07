import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SparkleIcon, ArrowRightIcon } from "@/components/icons";
import { blogPosts, getBlogPostBySlug } from "@/data/blog";

const TONE_STYLES: Record<string, { bg: string; icon: string; text: string }> = {
  blush: { bg: "bg-blush-100", icon: "text-blush-400", text: "text-blush-600" },
  mint: { bg: "bg-mint-100", icon: "text-mint-400", text: "text-mint-700" },
  peach: { bg: "bg-peach-100", icon: "text-peach-400", text: "text-peach-600" },
  lavender: { bg: "bg-lavender-100", icon: "text-lavender-400", text: "text-lavender-600" },
};

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  return { title: post ? post.title : "Blog", description: post?.excerpt };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) notFound();

  const styles = TONE_STYLES[post.tone];
  const more = blogPosts.filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <article className="container-page py-10 sm:py-14">
      <Breadcrumbs items={[{ label: "Blog", href: "/blog" }, { label: post.title }]} />

      <div className="mx-auto max-w-2xl">
        <span className={`text-xs font-semibold uppercase tracking-wide ${styles.text}`}>{post.category}</span>
        <h1 className="mt-2 font-display text-3xl font-bold leading-tight text-ink sm:text-4xl">
          {post.title}
        </h1>
        <div className="mt-3 flex items-center gap-2 text-sm text-ink/50">
          <time dateTime={post.publishedAt}>
            {new Date(post.publishedAt).toLocaleDateString("es-CO", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </time>
          <span>·</span>
          <span>{post.readTime}</span>
        </div>

        <div className={`mt-8 flex h-56 items-center justify-center rounded-[2rem] ${styles.bg}`}>
          <SparkleIcon className={`h-16 w-16 ${styles.icon}`} />
        </div>

        <div className="prose-content mt-10 flex flex-col gap-5">
          {post.content.map((paragraph, i) => (
            <p key={i} className="text-base leading-relaxed text-ink/75">
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      {more.length > 0 && (
        <div className="mx-auto mt-16 max-w-2xl border-t border-border pt-10">
          <h2 className="font-display text-xl font-bold text-ink">Sigue leyendo</h2>
          <div className="mt-5 flex flex-col gap-4">
            {more.map((p) => (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                className="group flex items-center justify-between gap-4 rounded-xl2 border border-border/70 p-4 transition-colors hover:border-blush-300"
              >
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-blush-600">{p.category}</p>
                  <p className="mt-1 font-display text-base font-bold text-ink">{p.title}</p>
                </div>
                <ArrowRightIcon className="h-4 w-4 shrink-0 text-ink/30 transition-transform duration-150 ease-out-strong group-hover:translate-x-0.5" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
