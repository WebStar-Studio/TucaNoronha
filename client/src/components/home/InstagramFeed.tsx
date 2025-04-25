import { Link } from 'wouter';

export default function InstagramFeed() {
  const instagramPosts = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1519951162248-c0a6c8b245b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80",
      url: "#",
      delay: "0.1s"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1586986100326-5a5bce2d75e5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1469&q=80",
      url: "#",
      delay: "0.15s"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1473&q=80",
      url: "#",
      delay: "0.2s"
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1597466599360-3b9775841aec?ixlib=rb-4.0.3&auto=format&fit=crop&w=1964&q=80",
      url: "#",
      delay: "0.25s"
    },
    {
      id: 5,
      image: "https://images.unsplash.com/photo-1511316695145-4992006ffddb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1363&q=80",
      url: "#",
      delay: "0.3s"
    },
    {
      id: 6,
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      url: "#",
      delay: "0.35s"
    }
  ];

  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-10 animate-slide-up">
        <h2 className="text-2xl sm:text-3xl font-montserrat font-medium text-foreground">#VivaNoronha</h2>
        <p className="mt-2 text-gray-600">Siga-nos no Instagram para doses diárias de paraíso</p>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {instagramPosts.map((post) => (
          <Link 
            key={post.id} 
            href={post.url} 
            className="rounded-lg overflow-hidden hover:opacity-90 transition animate-slide-up" 
            style={{animationDelay: post.delay}}
          >
            <img 
              src={post.image} 
              alt="Instagram post" 
              className="w-full h-full object-cover aspect-square"
            />
          </Link>
        ))}
      </div>
    </section>
  );
}
