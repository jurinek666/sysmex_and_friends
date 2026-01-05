import { Metadata } from "next";
import { Music2, ExternalLink } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Playlisty | SYSMEX & Friends Quiz Team",
  description: "Hudební playlisty SYSMEX & Friends Quiz Team",
};

export const revalidate = 60;

export default function PlaylistyPage() {
  // Sample playlists - will be replaced with real data from database
  const playlists = [
    {
      id: "1",
      title: "Tréninkový Playlist",
      description: "Skladby pro přípravu na kvízy",
      platform: "Spotify",
      url: "#",
      trackCount: 50,
    },
    {
      id: "2",
      title: "After Party Mix",
      description: "Oslavy po úspěšných turnajích",
      platform: "Spotify",
      url: "#",
      trackCount: 35,
    },
  ];

  return (
    <main className="min-h-screen pt-36 md:pt-44 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Music2 className="w-10 h-10 text-neon-magenta" strokeWidth={2} />
            <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-neon-magenta via-white to-neon-cyan bg-clip-text text-transparent">
              Playlisty
            </h1>
          </div>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Hudba, která nás provází během tréninků a oslav
          </p>
        </div>

        {/* Playlists Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {playlists.map((playlist) => (
            <Link
              key={playlist.id}
              href={playlist.url}
              className="bento-card p-6 group hover:border-neon-magenta/50 transition-all"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <Music2 className="w-5 h-5 text-neon-magenta" />
                      <span className="text-xs font-bold text-neon-magenta uppercase tracking-wider">
                        {playlist.platform}
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold text-white group-hover:text-neon-magenta transition-colors">
                      {playlist.title}
                    </h2>
                    <p className="text-gray-400 text-sm">
                      {playlist.description}
                    </p>
                  </div>
                  <ExternalLink className="w-5 h-5 text-gray-500 group-hover:text-neon-magenta transition-colors" />
                </div>
                
                <div className="pt-4 border-t border-white/5">
                  <p className="text-sm text-gray-500">
                    <span className="font-bold text-white">{playlist.trackCount}</span> skladeb
                  </p>
                </div>
              </div>
            </Link>
          ))}

          {/* Placeholder for more playlists */}
          <div className="bento-card p-8 text-center border-dashed">
            <div className="space-y-4">
              <Music2 className="w-12 h-12 text-neon-magenta/50 mx-auto" strokeWidth={1.5} />
              <h2 className="text-lg font-bold text-gray-400">Další playlisty brzy</h2>
              <p className="text-gray-500 text-sm">
                Připravujeme další hudební kolekce
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
