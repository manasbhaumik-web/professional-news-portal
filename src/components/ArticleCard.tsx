import React, { useState } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, Clock, BookMarked, Sparkles, Flame } from 'lucide-react';
import { NewsArticle } from '../types';
import { formatLocalTime } from '../utils/formatLocalTime';

/** Category-specific fallback images served from /public */
const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  politics: '/fallback-politics.png',
  business: '/fallback-business.png',
  election: '/fallback-election.png',
};

/** Region-specific fallback images served from /public */
const REGION_FALLBACK_IMAGES: Record<string, string> = {
  'north-america':    '/fallback-north-america.png',
  'south-america':    '/fallback-south-america.png',
  'central-america':  '/fallback-central-america.png',
  'europe':           '/fallback-europe.png',
  'arab':             '/fallback-arab.png',
  'africa':           '/fallback-africa.png',
  'south-asia':       '/fallback-south-asia.png',
  'southeast-asia':   '/fallback-southeast-asia.png',
  'east-asia':        '/fallback-east-asia.png',
  'central-asia':     '/fallback-central-asia.png',
  'oceania':          '/fallback-oceania.png',
};

/** Maps every country to its global region key */
const COUNTRY_TO_REGION: Record<string, string> = {
  // North America
  'United States': 'north-america', 'Canada': 'north-america', 'Mexico': 'north-america',
  // Central America & Caribbean
  'Guatemala': 'central-america', 'Belize': 'central-america', 'Honduras': 'central-america',
  'El Salvador': 'central-america', 'Nicaragua': 'central-america', 'Costa Rica': 'central-america',
  'Panama': 'central-america', 'Cuba': 'central-america', 'Jamaica': 'central-america',
  'Haiti': 'central-america', 'Dominican Republic': 'central-america', 'Trinidad and Tobago': 'central-america',
  'Bahamas': 'central-america', 'Barbados': 'central-america', 'Dominica': 'central-america',
  'Grenada': 'central-america', 'Saint Kitts and Nevis': 'central-america',
  'Saint Lucia': 'central-america', 'Saint Vincent and the Grenadines': 'central-america',
  'Antigua and Barbuda': 'central-america',
  // South America
  'Brazil': 'south-america', 'Argentina': 'south-america', 'Colombia': 'south-america',
  'Chile': 'south-america', 'Peru': 'south-america', 'Venezuela': 'south-america',
  'Ecuador': 'south-america', 'Bolivia': 'south-america', 'Paraguay': 'south-america',
  'Uruguay': 'south-america', 'Guyana': 'south-america', 'Suriname': 'south-america',
  // Europe
  'United Kingdom': 'europe', 'France': 'europe', 'Germany': 'europe', 'Italy': 'europe',
  'Spain': 'europe', 'Portugal': 'europe', 'Netherlands': 'europe', 'Belgium': 'europe',
  'Switzerland': 'europe', 'Austria': 'europe', 'Poland': 'europe', 'Czechia': 'europe',
  'Hungary': 'europe', 'Romania': 'europe', 'Bulgaria': 'europe', 'Greece': 'europe',
  'Sweden': 'europe', 'Norway': 'europe', 'Denmark': 'europe', 'Finland': 'europe',
  'Ireland': 'europe', 'Iceland': 'europe', 'Luxembourg': 'europe', 'Malta': 'europe',
  'Cyprus': 'europe', 'Estonia': 'europe', 'Latvia': 'europe', 'Lithuania': 'europe',
  'Slovakia': 'europe', 'Slovenia': 'europe', 'Croatia': 'europe', 'Serbia': 'europe',
  'Montenegro': 'europe', 'North Macedonia': 'europe', 'Albania': 'europe',
  'Bosnia and Herzegovina': 'europe', 'Moldova': 'europe', 'Ukraine': 'europe',
  'Belarus': 'europe', 'Russia': 'europe', 'Georgia': 'europe', 'Armenia': 'europe',
  'Andorra': 'europe', 'Monaco': 'europe', 'Liechtenstein': 'europe', 'San Marino': 'europe',
  'Vatican City': 'europe',
  // Arab World
  'Saudi Arabia': 'arab', 'United Arab Emirates': 'arab', 'Qatar': 'arab', 'Kuwait': 'arab',
  'Bahrain': 'arab', 'Oman': 'arab', 'Iraq': 'arab', 'Syria': 'arab', 'Jordan': 'arab',
  'Lebanon': 'arab', 'Palestine State': 'arab', 'Yemen': 'arab', 'Egypt': 'arab',
  'Libya': 'arab', 'Tunisia': 'arab', 'Algeria': 'arab', 'Morocco': 'arab',
  'Sudan': 'arab', 'Mauritania': 'arab', 'Djibouti': 'arab', 'Comoros': 'arab',
  'Somalia': 'arab', 'Iran': 'arab', 'Israel': 'arab', 'Turkey': 'arab',
  // South Asia
  'India': 'south-asia', 'Pakistan': 'south-asia', 'Bangladesh': 'south-asia',
  'Sri Lanka': 'south-asia', 'Nepal': 'south-asia', 'Bhutan': 'south-asia',
  'Maldives': 'south-asia', 'Afghanistan': 'south-asia',
  // Southeast Asia
  'Indonesia': 'southeast-asia', 'Malaysia': 'southeast-asia', 'Thailand': 'southeast-asia',
  'Philippines': 'southeast-asia', 'Vietnam': 'southeast-asia', 'Singapore': 'southeast-asia',
  'Myanmar': 'southeast-asia', 'Cambodia': 'southeast-asia', 'Laos': 'southeast-asia',
  'Brunei': 'southeast-asia', 'Timor-Leste': 'southeast-asia',
  // East Asia
  'China': 'east-asia', 'Japan': 'east-asia', 'South Korea': 'east-asia',
  'North Korea': 'east-asia', 'Taiwan': 'east-asia', 'Mongolia': 'east-asia',
  // Central Asia
  'Kazakhstan': 'central-asia', 'Uzbekistan': 'central-asia', 'Turkmenistan': 'central-asia',
  'Tajikistan': 'central-asia', 'Kyrgyzstan': 'central-asia', 'Azerbaijan': 'central-asia',
  // Africa (Sub-Saharan)
  'Nigeria': 'africa', 'South Africa': 'africa', 'Kenya': 'africa', 'Ethiopia': 'africa',
  'Ghana': 'africa', 'Tanzania': 'africa', 'Uganda': 'africa', 'Rwanda': 'africa',
  'Senegal': 'africa', 'Cameroon': 'africa', 'Congo (Congo-Brazzaville)': 'africa',
  'Democratic Republic of the Congo': 'africa', 'Angola': 'africa', 'Mozambique': 'africa',
  'Madagascar': 'africa', 'Malawi': 'africa', 'Zambia': 'africa', 'Zimbabwe': 'africa',
  'Botswana': 'africa', 'Namibia': 'africa', 'Gabon': 'africa', 'Equatorial Guinea': 'africa',
  'Cabo Verde': 'africa', 'Central African Republic': 'africa', 'Chad': 'africa',
  'Benin': 'africa', 'Burkina Faso': 'africa', 'Burundi': 'africa', 'Eritrea': 'africa',
  'Eswatini': 'africa', 'Gambia': 'africa', 'Guinea': 'africa', 'Guinea-Bissau': 'africa',
  'Ivory Coast': 'africa', 'Lesotho': 'africa', 'Liberia': 'africa', 'Mali': 'africa',
  'Mauritius': 'africa', 'Niger': 'africa', 'Sao Tome and Principe': 'africa',
  'Seychelles': 'africa', 'Sierra Leone': 'africa', 'South Sudan': 'africa', 'Togo': 'africa',
  // Oceania
  'Australia': 'oceania', 'New Zealand': 'oceania', 'Fiji': 'oceania', 'Papua New Guinea': 'oceania',
  'Samoa': 'oceania', 'Tonga': 'oceania', 'Vanuatu': 'oceania', 'Solomon Islands': 'oceania',
  'Kiribati': 'oceania', 'Micronesia': 'oceania', 'Marshall Islands': 'oceania',
  'Palau': 'oceania', 'Nauru': 'oceania', 'Tuvalu': 'oceania',
};

/**
 * Resolve a fallback image for an article based on its category and,
 * for country news, its sportName (which holds the country name).
 */
const REGION_NAME_TO_KEY: Record<string, string> = {
  'arab': 'arab',
  'north america': 'north-america',
  'latin america': 'south-america',
  'south america': 'south-america',
  'central america': 'central-america',
  'europe': 'europe',
  'sub-saharan africa': 'africa',
  'africa': 'africa',
  'south asia': 'south-asia',
  'south east asia': 'southeast-asia',
  'southeast asia': 'southeast-asia',
  'east asia': 'east-asia',
  'central asia': 'central-asia',
  'oceania': 'oceania',
  'global': 'europe', // sensible default for 'Global' category
};

function getArticleFallbackImage(category: string, sportName?: string): string | undefined {
  const cat = (category || '').toLowerCase();

  // 1. Country feed → region-based fallback
  if (cat === 'country' && sportName) {
    const region = COUNTRY_TO_REGION[sportName];
    if (region && REGION_FALLBACK_IMAGES[region]) return REGION_FALLBACK_IMAGES[region];
  }

  // 2. Region-name category match (e.g. category = 'Arab', 'South Asia', 'East Asia')
  const regionKey = REGION_NAME_TO_KEY[cat];
  if (regionKey && REGION_FALLBACK_IMAGES[regionKey]) return REGION_FALLBACK_IMAGES[regionKey];

  // 3. Category-specific fallback
  if (CATEGORY_FALLBACK_IMAGES[cat]) return CATEGORY_FALLBACK_IMAGES[cat];

  // 4. Keyword-based category match
  if (cat.includes('politic') || cat.includes('policy') || cat.includes('government'))
    return CATEGORY_FALLBACK_IMAGES.politics;
  if (cat.includes('business') || cat.includes('finance') || cat.includes('market') || cat.includes('economy'))
    return CATEGORY_FALLBACK_IMAGES.business;
  if (cat.includes('election') || cat.includes('vote') || cat.includes('ballot'))
    return CATEGORY_FALLBACK_IMAGES.election;

  return undefined;
}

interface ArticleCardProps {
  key?: React.Key;
  index?: number;
  art: NewsArticle;
  handleOpenArticle: (art: NewsArticle) => void;
  toggleBookmark: (id: string, e: React.MouseEvent) => void;
  isBookmarked: boolean;
  isCustomFeed?: boolean;
  failedImages?: string[];
  setFailedImages?: (f: any) => void;
  minimal?: boolean;
}

const itemVariants: any = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

export default React.memo(function ArticleCard({
  art,
  index,
  handleOpenArticle,
  toggleBookmark,
  isBookmarked,
  isCustomFeed = false,
  failedImages = [],
  setFailedImages,
  minimal = false
}: ArticleCardProps) {
  const [imgError, setImgError] = useState(false);

  const hasMissingImage = !art.imageUrl || imgError || (failedImages && failedImages.includes(art.id));

  let layoutClass = 'flex-col sm:flex-row';
  let imageClass = 'w-full sm:w-36 h-28';
  let isHero = false;
  let isCompact = false;
  let isSubFeature = false;

  if (index !== undefined) {
    const patternIndex = index % 6;
    if (patternIndex === 0) {
      // Hero (full width, large image)
      layoutClass = 'md:col-span-2 flex-col';
      imageClass = 'w-full h-64 sm:h-[400px] mb-4';
      isHero = true;
    } else if (patternIndex === 1 || patternIndex === 2) {
      // Sub-feature (half width, medium image)
      layoutClass = 'col-span-1 flex-col';
      imageClass = 'w-full h-48 mb-3';
      isSubFeature = true;
    } else {
      // Compact list (full width, small thumbnail)
      layoutClass = 'md:col-span-2 flex-col sm:flex-row items-start sm:items-center py-2';
      imageClass = 'hidden sm:block w-24 h-24 shrink-0 sm:mr-6 mb-3 sm:mb-0';
      isCompact = true;
    }
  }

  if (minimal) {
    layoutClass = 'flex-row items-center';
    imageClass = 'w-24 h-24 sm:w-28 sm:h-28 shrink-0 mr-4';
    isHero = false;
    isSubFeature = false;
    isCompact = true;
  }

  return (
    <motion.article
      variants={itemVariants}
      onClick={() => handleOpenArticle(art)}
      tabIndex={0}
      role="article"
      aria-label={`Article: ${art.title}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleOpenArticle(art);
        }
      }}
      className={`relative transition-all duration-300 hover:-translate-y-1 group cursor-pointer flex gap-0 sm:gap-0 bg-transparent border-b border-portal-border/60 pb-6 mb-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-portal-brand focus-visible:ring-offset-4 focus-visible:ring-offset-portal-bg ${layoutClass} ${minimal ? 'pb-4 mb-0 border-b border-portal-border/30' : ''}`}
    >
      <div className={`overflow-hidden relative bg-portal-bg flex items-center justify-center ${imageClass} ${!isCompact && !minimal ? 'w-full' : ''}`}>
        {!hasMissingImage ? (
          <img
            src={art.imageUrl}
            alt={art.title.replace(/\bFeeds?\b/gi, '').replace(/\s+/g, ' ').trim()}

            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            onError={(e) => {
              setImgError(true);
              if (setFailedImages) setFailedImages((prev: string[]) => [...prev, art.id]);
            }}
          />
        ) : (() => {
          const categoryFallback = getArticleFallbackImage(art.category, art.sportName);
          return categoryFallback ? (
            <img
              src={categoryFallback}
              alt={`${art.category} fallback`}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out opacity-70"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-4 sm:p-6 bg-portal-surface/50 border-r border-b border-portal-border/30">
               {!isCompact && !minimal ? (
                   <div className="text-center w-full flex flex-col items-center justify-center h-full">
                       <span className="block text-[80px] sm:text-[120px] leading-none font-serif font-black text-portal-text-muted/20 select-none">
                           {art.title.replace(/['"]+/g, '').charAt(0).toUpperCase()}
                       </span>
                       <p className="text-portal-text-muted font-mono text-[10px] uppercase tracking-widest relative z-10 mt-2">
                           {art.category} Report
                       </p>
                   </div>
               ) : (
                   <span className="text-3xl font-serif font-black text-portal-text-muted/30">
                       {art.title.replace(/['"]+/g, '').charAt(0).toUpperCase()}
                   </span>
               )}
            </div>
          );
        })()}

        {art.trendsUp && !isCustomFeed && !isCompact && (
          <div className="absolute top-2 left-2 bg-emerald-500 text-white text-[9px] font-bold px-1.5 py-0.5 flex items-center space-x-0.5">
            <TrendingUp size={10} />
            <span>Trending</span>
          </div>
        )}
        {isCustomFeed && !isCompact && (
          <div className="absolute top-2 left-2 bg-portal-accent text-white text-[9px] font-bold px-1.5 py-0.5 flex items-center space-x-1">
            <Sparkles size={10} className="animate-pulse" />
            <span>Custom</span>
          </div>
        )}
        {art.is_breaking && !isCompact && (
          <div className="absolute top-2 right-2 bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.5 flex items-center space-x-1 z-20">
            <Flame size={10} className="animate-pulse" />
            <span>BREAKING</span>
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col justify-center min-w-0 w-full">
        <header className="flex items-center text-[10px] sm:text-[11px] font-mono uppercase mb-2">
          <span className="font-bold tracking-wider text-portal-accent">{art.category}</span>
          <span className="text-portal-text-muted mx-2">•</span>
          <span className="text-portal-text-muted truncate mr-2">{art.source}</span>
          <time dateTime={formatLocalTime(art.date, art.publishedAt)} className="text-portal-text-muted shrink-0 ml-auto">{art.timeAgo || formatLocalTime(art.date, art.publishedAt)}</time>
        </header>

        <h4 className={`text-portal-text-main group-hover:text-portal-brand transition-colors font-serif font-bold leading-tight mb-2 ${isHero ? 'text-3xl sm:text-4xl' : isSubFeature ? 'text-xl sm:text-2xl' : 'text-lg sm:text-xl'} ${minimal ? 'line-clamp-2 text-base' : ''}`}>
          {art.title.replace(/\bFeeds?\b/gi, '').replace(/\s+/g, ' ').trim()}
        </h4>

        {!isCompact && !minimal && (
          <p className={`text-sm ${isHero ? 'line-clamp-3 sm:line-clamp-4 text-base' : 'line-clamp-2'} text-portal-text-muted mb-4`}>
            {art.summary}
          </p>
        )}

        <footer className={`flex items-center justify-between text-[10px] font-mono text-portal-text-muted ${isCompact ? 'mt-1' : 'mt-auto'}`}>
          <div className="flex items-center space-x-3">
            <span className="flex items-center space-x-1">
              <Clock size={12} />
              <span>{art.readTime || '4 min read'}</span>
            </span>
          </div>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={(e) => toggleBookmark(art.id, e)}
            className="flex items-center justify-center p-1.5 hover:text-portal-text-main transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-portal-brand"
            title="Bookmark article"
            aria-label={isBookmarked ? "Remove from Bookmarks" : "Add to Bookmarks"}
          >
            <BookMarked size={14} className={isBookmarked ? "text-portal-brand fill-portal-brand" : ""} />
          </motion.button>
        </footer>
      </div>
    </motion.article>
  );
});
