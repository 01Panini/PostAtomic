import { useEffect } from 'react';
import { usePosts } from '../hooks/usePosts';
import { useBrand } from '../contexts/BrandContext';

const FORMAT_LABELS = { post: 'Post Único', carousel: 'Carrossel', story: 'Story' };

const FORMAT_ICONS = {
    post: (
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="2" />
        </svg>
    ),
    carousel: (
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
            <rect x="5" y="5" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
            <path d="M2 9v6M22 9v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
    ),
    story: (
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
            <rect x="7" y="2" width="10" height="20" rx="3" stroke="currentColor" strokeWidth="2" />
        </svg>
    ),
};

function PostCard({ post }) {
    const slide = post.slides?.[0];
    const brand = useBrand();
    const primaryColor = brand?.colors?.primary || '#2563EB';

    const date = new Date(post.created_at).toLocaleDateString('pt-BR', {
        day: '2-digit', month: 'short', year: 'numeric',
    });

    return (
        <div className="bg-[#060E20] border border-white/[.05] rounded-2xl p-4 hover:border-[#2563EB]/25 transition-all cursor-default group">
            {/* Mini preview */}
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
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-[#4D6B8A]">
                    <span className="text-[#4D6B8A]">{FORMAT_ICONS[post.format]}</span>
                    {FORMAT_LABELS[post.format] || post.format}
                </span>
                {post.slides?.length > 1 && (
                    <span className="text-[10px] text-[#4D6B8A] font-medium">{post.slides.length} slides</span>
                )}
            </div>

            <p className="text-xs font-semibold text-[#F0F6FF] leading-snug mb-1 line-clamp-2">
                {slide?.headline || post.topic || '—'}
            </p>
            <p className="text-[10px] text-[#4D6B8A]">{date}</p>

            {post.caption && (
                <div className="mt-3 pt-3 border-t border-white/[.05]">
                    <p className="text-[11px] text-[#8BA8C8] leading-relaxed line-clamp-3">{post.caption}</p>
                </div>
            )}
        </div>
    );
}

export default function DashboardPage() {
    const { posts, loading, load } = usePosts();

    useEffect(() => { load(); }, [load]);

    return (
        <div className="h-full overflow-y-auto p-6 bg-[#03091A]">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold tracking-tight mb-1 text-[#F0F6FF]">Histórico</h1>
                    <p className="text-sm text-[#4D6B8A]">Seus últimos 20 posts gerados.</p>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="flex items-center justify-center py-24">
                        <div className="w-8 h-8 border-2 border-[#2563EB]/20 border-t-[#2563EB] rounded-full animate-spin" />
                    </div>
                ) : posts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-[#2563EB]/[.08] border border-[#2563EB]/15 flex items-center justify-center mb-4">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                                <rect x="5" y="5" width="14" height="14" rx="2" stroke="#2563EB" strokeWidth="1.5" />
                                <path d="M2 9v6M22 9v6" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                        </div>
                        <p className="text-base font-bold text-[#F0F6FF] mb-2">Nenhum post ainda</p>
                        <p className="text-sm text-[#4D6B8A] max-w-xs leading-relaxed">
                            Vá para o <strong className="text-[#60A5FA]">Post Machine</strong> e gere seu primeiro post.
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
