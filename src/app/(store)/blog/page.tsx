import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SparkleIcon } from "@/components/icons";
import { blogPosts } from "@/data/blog";

export const metadata: Metadata = { title: "Blog" };

const TONE_STYLES: Record<string, { bg: string; icon: string; text: string }> = {
  blush: { bg: "bg-blush-100", icon: "text-blush-400", text: "text-blush-600" },
  mint: { bg: "bg-mint-100", icon: "text-mint-400", text: "text-mint-700" },
  peach: { bg: "bg-peach-100", icon: "text-peach-400", text: "text-peach-600" },
  lavender: { bg: "bg-lavender-100", icon: "text-lavender-400", text: "text-lavender-600" },
};

export default function BlogPage() {
  return (
    <div className="container-page py-10 sm:py-14">
      <Breadcrumbs items={[{ label: "Blog" }]} />
      <div className="max-w-2xl">
        <h1 className="font-display text-3xl font-bold text-ink sm:text-4xl">El diario Rumí</h1>
        <p className="mt-3 text-base leading-relaxed text-ink/65">
          Guías, ingredientes y consejos para entender tu piel y sacarle el máximo
          provecho a tu rutina de skincare coreano.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {blogPosts.map((post) => {
          const styles = TONE_STYLES[post.tone];
          return (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group card-surface flex flex-col overflow-hidden transition-transform duration-200 ease-out-strong hover:-translate-y-1"
            >
              <div className={`flex h-36 items-center justify-center ${styles.bg}`}>
                <SparkleIcon className={`h-10 w-10 ${styles.icon}`} />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <span className={`text-xs font-semibold uppercase tracking-wide ${styles.text}`}>
                  {post.category}
                </span>
                <h2 className="mt-2 font-display text-lg font-bold leading-snug text-ink group-hover:text-blush-600">
                  {post.title}
                </h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-ink/60">{post.excerpt}</p>
                <div className="mt-4 flex items-center justify-between text-xs text-ink/45">
                  <span>{post.readTime}</span>
                  <time dateTime={post.publishedAt}>
                    {new Date(post.publishedAt).toLocaleDateString("es-CO", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </time>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
