import { useEffect } from 'react';
import { usePosts } from '../hooks/usePosts';
import { useBrand } from '../contexts/BrandContext';

const FMT = { post: 'Post', carousel: 'Carrossel', story: 'Story' };

function PostCard({ post }) {
    const slide = post.slides?.[0];
    const brand = useBrand();
    const primary = brand?.colors?.primary || '#0CC981';
    const date = new Date(post.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });

    return (
        <div style={{
            background: '#121212', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12,
            overflow: 'hidden', transition: 'border-color 0.15s, background 0.15s', cursor: 'default',
        }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.background = '#161616'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.background = '#121212'; }}>

            {/* Preview */}
            <div style={{
                aspectRatio: '4/5', background: `radial-gradient(ellipse at 50% 0%, ${primary}28 0%, #050505 60%)`,
                padding: '0 14px 14px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
            }}>
                {slide?.stat && <p style={{ fontSize: 22, fontWeight: 900, color: '#fff', lineHeight: 1, marginBottom: 4 }}>{slide.stat}</p>}
                <p style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.7)', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {slide?.headline || post.topic || '—'}
                </p>
            </div>

            {/* Meta */}
            <div style={{ padding: '10px 14px 12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#616161' }}>
                        {FMT[post.format] || post.format}
                    </span>
                    {post.slides?.length > 1 && <span style={{ fontSize: 10, color: '#616161' }}>{post.slides.length} slides</span>}
                </div>
                <p style={{ fontSize: 10, color: '#616161' }}>{date}</p>
            </div>
        </div>
    );
}

export default function DashboardPage() {
    const { posts, loading, load } = usePosts();
    useEffect(() => { load(); }, [load]);

    return (
        <div style={{ height: '100%', overflowY: 'auto', padding: 32, background: '#050505', fontFamily: 'Inter, sans-serif' }}>
            <div style={{ maxWidth: 1100, margin: '0 auto' }}>
                <div style={{ marginBottom: 32 }}>
                    <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.4, color: '#FFFFFF', marginBottom: 4 }}>Histórico</h1>
                    <p style={{ fontSize: 13, color: '#616161' }}>Seus últimos 20 posts gerados.</p>
                </div>

                {loading ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 0' }}>
                        <div style={{ width: 28, height: 28, border: '2px solid rgba(255,255,255,0.08)', borderTopColor: '#0CC981', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                    </div>
                ) : posts.length === 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 0', textAlign: 'center' }}>
                        <div style={{ width: 52, height: 52, borderRadius: 12, background: '#121212', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="5" y="5" width="14" height="14" rx="2" stroke="#616161" strokeWidth="1.5" /><path d="M2 9v6M22 9v6" stroke="#616161" strokeWidth="1.5" strokeLinecap="round" /></svg>
                        </div>
                        <p style={{ fontSize: 15, fontWeight: 600, color: '#FFFFFF', marginBottom: 6 }}>Nenhum post ainda</p>
                        <p style={{ fontSize: 13, color: '#616161', maxWidth: 260, lineHeight: 1.5 }}>
                            Vá para o <strong style={{ color: '#0CC981' }}>Post Machine</strong> e gere seu primeiro post.
                        </p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
                        {posts.map(p => <PostCard key={p.id} post={p} />)}
                    </div>
                )}
            </div>
        </div>
    );
}
