import { useEffect } from 'react';
import { usePosts } from '../hooks/usePosts';
import { useBrand } from '../contexts/BrandContext';

const FORMAT_LABELS = { post: 'Post Único', carousel: 'Carrossel', story: 'Story' };
const FORMAT_ICONS = { post: '🖼', carousel: '🎠', story: '📱' };

function PostCard({ post }) {
    const slide = post.slides?.[0];
    const brand = useBrand();
    const primaryColor = brand?.colors?.primary || '#0057B7';

    const date = new Date(post.created_at).toLocaleDateString('pt-BR', {
        day: '2-digit', month: 'short', year: 'numeric',
    });

    return (
        <div className="bg-surface border border-border rounded-2xl p-4 hover:border-border-2 transition-all group cursor-default">
            {/* Mini preview placeholder */}
            <div className="aspect-[4/5] w-full rounded-xl mb-3 overflow-hidden flex items-end p-3"
                style={{ background: `radial-gradient(ellipse 100% 52% at 50% -8%, ${primaryColor}33 0%, #040C1A 55%)` }}>
                {slide && (
                    <div className="w-full">
                        {slide.stat && <p className="text-white font-black text-2xl leading-none mb-1">{slide.stat}</p>}
                        <p className="text-white text-xs font-bold leading-snug line-clamp-3">{slide.headline}</p>
                    </div>
                )}
            </div>

            {/* Meta */}
            <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-text-3">
                    {FORMAT_ICONS[post.format]} {FORMAT_LABELS[post.format] || post.format}
                </span>
                {post.slides?.length > 1 && (
                    <span className="text-[10px] text-text-3 font-bold">{post.slides.length} slides</span>
                )}
            </div>

            <p className="text-xs font-bold text-text-1 leading-snug mb-1 line-clamp-2">
                {slide?.headline || post.topic || '—'}
            </p>

            <p className="text-[10px] text-text-3">{date}</p>

            {post.caption && (
                <div className="mt-3 pt-3 border-t border-border">
                    <p className="text-[11px] text-text-2 leading-relaxed line-clamp-3">{post.caption}</p>
                </div>
            )}
        </div>
    );
}

export default function DashboardPage() {
    const { posts, loading, load } = usePosts();

    useEffect(() => { load(); }, [load]);

    return (
        <div className="h-full overflow-y-auto p-6" style={{ fontFamily: "'Satoshi',sans-serif" }}>
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-black tracking-tight mb-1 text-text-1">Histórico</h1>
                    <p className="text-sm text-text-2">Seus últimos 20 posts gerados.</p>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="flex items-center justify-center py-24">
                        <div className="w-8 h-8 border-2 border-blue/20 border-t-blue rounded-full animate-spin" />
                    </div>
                ) : posts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-blue/[.08] border border-blue/15 flex items-center justify-center text-3xl mb-4">
                            🎠
                        </div>
                        <p className="text-base font-extrabold text-text-1 mb-2">Nenhum post ainda</p>
                        <p className="text-sm text-text-2 max-w-xs leading-relaxed">
                            Vá para o <strong className="text-blue-light">Post Machine</strong> e gere seu primeiro post.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {posts.map((p) => <PostCard key={p.id} post={p} />)}
                    </div>
                )}
            </div>
        </div>
    );
}
