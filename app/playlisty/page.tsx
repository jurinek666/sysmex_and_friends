import { Metadata } from "next";
import { Music2 } from "lucide-react";
import { getAllPlaylists } from "@/lib/queries/playlists";

export const metadata: Metadata = {
  title: "Playlisty | SYSMEX & Friends Quiz Team",
  description: "Hudební playlisty SYSMEX & Friends Quiz Team",
};

export const revalidate = 60;

interface Playlist {
  id: string;
  title: string;
  spotifyUrl: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
}

export default async function PlaylistyPage() {
  const playlists = await getAllPlaylists();

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
        {playlists && playlists.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {playlists.map((playlist: Playlist) => (
              <div
                key={playlist.id}
                className="bento-card p-6 group hover:border-neon-magenta/50 transition-all"
              >
                <div className="space-y-4">
                  {/* Header */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Music2 className="w-5 h-5 text-neon-magenta" />
                      <span className="text-xs font-bold text-neon-magenta uppercase tracking-wider">
                        Spotify
                      </span>
                      {playlist.isActive && (
                        <span className="px-2 py-0.5 bg-neon-magenta/20 text-neon-magenta text-[10px] font-bold uppercase rounded-full">
                          Aktivní
                        </span>
                      )}
                    </div>
                    <h2 className="text-2xl font-bold text-white group-hover:text-neon-magenta transition-colors">
                      {playlist.title}
                    </h2>
                    {playlist.description && (
                      <p className="text-gray-400 text-sm">
                        {playlist.description}
                      </p>
                    )}
                  </div>

                  {/* Spotify Embed */}
                  <div className="mt-4 w-full overflow-hidden rounded-lg">
                    {playlist.spotifyUrl ? (
                      <div className="w-full">
                        {playlist.spotifyUrl.includes('<iframe') ? (
                          <div
                            dangerouslySetInnerHTML={{ __html: playlist.spotifyUrl }}
                            className="w-full [&>iframe]:w-full [&>iframe]:h-[352px] [&>iframe]:rounded-lg [&>iframe]:border-0 [&>iframe]:min-h-[352px]"
                          />
                        ) : (
                          <iframe
                            src={playlist.spotifyUrl}
                            width="100%"
                            height="352"
                            frameBorder="0"
                            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                            loading="lazy"
                            className="w-full h-[352px] rounded-lg border-0"
                          />
                        )}
                      </div>
                    ) : (
                      <div className="text-gray-500 text-sm italic p-4 text-center bg-white/5 rounded-lg">
                        Playlist není k dispozici
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bento-card p-12 text-center">
            <div className="space-y-4">
              <Music2 className="w-16 h-16 text-neon-magenta/50 mx-auto" strokeWidth={1.5} />
              <h2 className="text-2xl font-bold text-white">Zatím nejsou žádné playlisty</h2>
              <p className="text-gray-400">
                Připravujeme hudební kolekce pro náš tým
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
