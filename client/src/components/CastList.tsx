import React from 'react';
import { CastMember } from '@/lib/types';
import { getProfileUrl } from '@/lib/api';

interface CastListProps {
  cast: CastMember[];
}

const CastList: React.FC<CastListProps> = ({ cast }) => {
  if (!cast || cast.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <h3 className="text-xl font-bold mb-4">Cast</h3>
      <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar md:pb-2 snap-x snap-mandatory">
        {cast.map((actor) => (
          <div key={actor.id} className="flex-shrink-0 w-24">
            <img 
              src={getProfileUrl(actor.profile_path)} 
              alt={actor.name}
              className="w-full h-24 object-cover rounded-lg"
              loading="lazy"
            />
            <div className="mt-2 text-center">
              <p className="text-sm font-medium">{actor.name}</p>
              <p className="text-xs text-[#e0e0e0]">{actor.character}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CastList;
