// Topic-specific discovery; suggestions only appear when this catalog can answer them.
const categoryGuides={
 'Music & DJ':['Set the night in motion.','Flyers, lineups and release artwork for your next sound.',['DJ','rave','jazz','festival','vinyl']],
 Podcast:['Give your voice a visual.','Episode covers, guest announcements and listening guides.',['episode','guest','interview','cover']],
 Fitness:['Make the next move.','Class promotions, training plans and community challenges.',['workout','class','challenge','fitness']],
 Wellness:['Make room for a reset.','Thoughtful designs for mindful routines and wellbeing.',['retreat','journal','yoga','wellness']],
 Beauty:['Your next signature look.','Booking notices, service menus and beauty promotions.',['booking','salon','skincare','beauty']],
 'Food & Drink':['Something worth gathering for.','Menus, opening announcements and food stories.',['menu','cafe','restaurant','market']],
 Gaming:['Make your next play.','Tournament posters, channel banners and stream screens. Build a look your community will recognize.',['tournament','stream','esports','controller','pixel','chess','tabletop']],
 Education:['Turn a lesson into a discovery.','Worksheets, schedules and classroom resources to make your own.',['worksheet','calendar','workshop','school']],
 'Real Estate':['Give every space a story.','Property highlights, open-house promotions and floor plans.',['property','floor plan','open house']],
 Weddings:['Make it a day to remember.','Invitations and details for your celebration.',['invitation','wedding','day']],
 'Faith & Community':['Bring your community together.','Gatherings, volunteer opportunities and community notices.',['community','volunteer','gathering']],
 Nonprofit:['Design for a cause.','Fundraising, food drives and campaigns for your community.',['donation','fundraiser','volunteer','food drive']],
 Pets:['A little more paw-sonality.','Pet care, adoption and neighborhood notices.',['pet','lost','adoption']],
 Crafts:['Made by hand. Shared with heart.','Workshop guides and small-maker promotions.',['workshop','craft','maker']],
 Books:['Every story starts somewhere.','Reading lists, club guides and book announcements.',['book','reading','club']],
 Travel:['Find your next somewhere.','City guides, itineraries and travel stories.',['city','itinerary','coast','travel']],
 Photography:['Frame a different perspective.','Portfolios, photo stories and creative services.',['portfolio','portrait','exhibition','photography']],
 'Small Business':['Small business. Big personality.','Loyalty cards, market flyers and everyday promotions.',['loyalty','market','sale','shop']],
 Technology:['Make the complex feel clear.','Product launches, roadmaps and technology explainers.',['roadmap','launch','technology']],
 Sports:['Bring the match to life.','Matchday announcements and club information.',['match','team','sports']],
 Gardening:['Good things take growing.','Plant-care guides, garden journals and growing ideas.',['plant','garden','care']],
 Celebrations:['An invitation to make memories.','Birthdays, seasonal parties and special occasions.',['birthday','halloween','party','invitation']],
 Entertainment:['Give the show a great opening.','Screenings, performances and production planning.',['film','show','theatre','comedy','music']],
 Marketing:['Make your message count.','Campaign briefs, promotions and creative announcements.',['campaign','launch','promo','brief']],
 Fashion:['A look with something to say.','Lookbooks, editorial stories and collection launches.',['lookbook','collection','fashion']]
};
function categoryGuide(topic){return categoryGuides[topic]||['A new point of view.','Find a composition that feels like you. Preview it, save it, then make it your own.',['Gaming','DJ','Cities','Fashion','Podcast','Wedding']];}
function categorySuggestions(items,topic){return categoryGuide(topic)[2].filter(query=>items.some(t=>matchesCatalog(t,query)));}
function categoryFeature(items,topic){
 const order=topic==='Gaming'?['gaming-22','gaming-07','gaming-02','gaming-06','gaming-13','gaming-17','gaming-01','gaming-23','gaming-05','gaming-14','gaming-21','gaming-24','gaming-10','gaming-12','gaming-03']:[];
 const selected=order.map(id=>items.find(t=>t.id===id)).filter(Boolean);
 const fresh=items.filter(t=>t.collection==='category-stories'||t.collection==='gaming');
 const seen=new Set();return [...selected,...fresh,...items].filter(t=>!seen.has(t.id)&&seen.add(t.id));
}
function categoryGamingSections(items){
 return [
  {id:'posters',title:'Posters & event promos',note:'Tournament nights, team tryouts and your next meetup.',items:items.filter(t=>t.height>t.width)},
  {id:'screens',title:'Banners & stream screens',note:'Editable still designs for your channel and broadcasts.',items:items.filter(t=>t.width>t.height)},
  {id:'social',title:'Social posts & team identities',note:'Square artwork for your gaming community.',items:items.filter(t=>!(t.height>t.width)&&!(t.width>t.height))}
 ].filter(section=>section.items.length);
}
