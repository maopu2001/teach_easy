export const products = [
  {
    id: "1",
    name: "Basic Math Workbook",
    price: 3000,
    discountInPercent: 0,
    rating: 3,
    noOfRating: 10,
    category: "Mathematics",
    class: "Class 1",
    tag: "New",
    imageUrl: "/95443.png",
    description:
      "Comprehensive math workbook covering all essential Grade 3 topics including addition, subtraction, multiplication, division, fractions, and geometry. Perfect for classroom use or homework assignments.",
    fullDescription:
      "Master fundamental mathematics with this thoughtfully designed workbook perfect for Class 1 students. This comprehensive resource introduces young learners to the exciting world of numbers through carefully structured lessons and engaging activities. Each chapter builds upon previous concepts, ensuring a solid mathematical foundation. The workbook features colorful illustrations and real-world examples that make abstract concepts tangible and relatable. Students will develop problem-solving skills while gaining confidence in basic arithmetic operations. Interactive exercises encourage active learning and help reinforce key concepts. Perfect for both classroom instruction and independent study at home. Teachers appreciate the clear progression of skills and the variety of assessment tools included.",
    keyFeatures: [
      "200+ practice problems",
      "Answer key included",
      "Aligned with Common Core standards",
      "Printable worksheets",
    ],
    stock: 100,
    isAvailable: true,
    get isOutOfStock() {
      return this.stock <= 0 || !this.isAvailable;
    },
    get isLowStock() {
      return this.stock > 0 && this.stock <= 5;
    },
  },
  {
    id: "2",
    name: "Advanced Mathematics Guide",
    price: 4000,
    discountInPercent: 90,
    rating: 4.2,
    noOfRating: 5,
    category: "Mathematics",
    class: "Class 2",
    tag: "Bestseller",
    imageUrl: "/95443.png",
    description:
      "Comprehensive math workbook covering all essential Grade 3 topics including addition, subtraction, multiplication, division, fractions, and geometry. Perfect for classroom use or homework assignments.",
    fullDescription:
      "Elevate mathematical understanding with this advanced guide designed for Class 2 students ready to tackle more complex concepts. This bestselling resource combines rigorous academic content with innovative teaching methodologies to create an engaging learning experience. Students will explore advanced arithmetic, early algebraic thinking, geometric reasoning, and data analysis through hands-on activities and real-world applications. The guide emphasizes critical thinking and problem-solving strategies that prepare students for higher-level mathematics. Each lesson includes multiple difficulty levels to accommodate diverse learning needs and paces. Visual learners benefit from detailed diagrams and step-by-step illustrations, while kinesthetic learners engage with interactive manipulatives and activities. Assessment tools help track progress and identify areas for additional support.",
    keyFeatures: [
      "200+ practice problems",
      "Answer key included",
      "Aligned with Common Core standards",
      "Printable worksheets",
    ],
    stock: 50,
    isAvailable: true,
    get isOutOfStock() {
      return this.stock <= 0 || !this.isAvailable;
    },
    get isLowStock() {
      return this.stock > 0 && this.stock <= 5;
    },
  },
  {
    id: "3",
    name: "Science Fundamentals",
    price: 2500,
    discountInPercent: 25,
    rating: 4.5,
    noOfRating: 15,
    category: "Science",
    class: "Class 3",
    tag: "Popular",
    imageUrl: "/95443.png",
    description:
      "Explore the fascinating world of science with this comprehensive guide covering physics, chemistry, and biology fundamentals.",
    fullDescription:
      "Discover the wonders of science through this comprehensive and engaging fundamentals guide designed for Class 3 students. This popular resource transforms complex scientific concepts into accessible, exciting learning adventures that spark curiosity and foster a lifelong love of science. Students explore the three core branches of science - physics, chemistry, and biology - through carefully designed experiments, observations, and investigations. Each chapter begins with real-world phenomena that students can relate to, making abstract concepts concrete and meaningful. Safety is emphasized throughout, with clear guidelines and procedures for all activities. The guide includes detailed explanations of scientific methods, encouraging students to think like scientists by asking questions, forming hypotheses, and drawing conclusions based on evidence. Colorful photographs and illustrations support visual learning while hands-on activities cater to kinesthetic learners.",
    keyFeatures: [
      "Interactive experiments",
      "Colorful illustrations",
      "Lab safety guidelines",
      "Chapter quizzes",
    ],
    stock: 2,
    isAvailable: true,
    get isOutOfStock() {
      return this.stock <= 0 || !this.isAvailable;
    },
    get isLowStock() {
      return this.stock > 0 && this.stock <= 5;
    },
  },
  {
    id: "4",
    name: "English Literature Collection",
    price: 3500,
    discountInPercent: 15,
    rating: 4.0,
    noOfRating: 8,
    category: "English",
    class: "Class 4",
    imageUrl: "/95443.png",
    description:
      "A curated collection of classic and modern literature pieces perfect for developing reading comprehension and critical thinking skills.",
    fullDescription:
      "Immerse yourself in the rich world of literature with this thoughtfully curated collection designed for Class 4 students. This comprehensive anthology bridges classic and contemporary works, exposing students to diverse voices, themes, and literary styles that shape our understanding of the human experience. Each selection has been carefully chosen for its educational value, cultural significance, and age-appropriate content. Students will encounter timeless tales that have captivated readers for generations alongside modern stories that reflect contemporary life and values. The collection emphasizes the development of critical reading skills, encouraging students to analyze characters, identify themes, and understand literary devices. Guided reading activities help students engage deeply with texts while building vocabulary and comprehension skills. Discussion questions promote classroom dialogue and help students articulate their thoughts and interpretations. Writing prompts connected to each selection encourage creative expression and analytical thinking.",
    keyFeatures: [
      "20 classic stories",
      "Reading comprehension questions",
      "Vocabulary builders",
      "Discussion guides",
    ],
    stock: 50,
    isAvailable: true,
    get isOutOfStock() {
      return this.stock <= 0 || !this.isAvailable;
    },
    get isLowStock() {
      return this.stock > 0 && this.stock <= 5;
    },
  },
  {
    id: "5",
    name: "Premium Art Supplies Kit",
    price: 5000,
    discountInPercent: 50,
    rating: 4.8,
    noOfRating: 25,
    category: "Art",
    tag: "Limited Edition",
    imageUrl: "/95443.png",
    description:
      "Professional-grade art supplies including watercolors, brushes, pencils, and sketchbooks for aspiring young artists.",
    fullDescription:
      "Unleash creativity with this exceptional limited edition art supplies kit designed for aspiring artists of all ages. This premium collection combines professional-grade materials with educational resources to provide a complete artistic foundation. Each component has been carefully selected for its quality, durability, and versatility, ensuring students can explore various artistic techniques and mediums with confidence. The kit includes high-quality watercolor paints with vibrant pigments that blend beautifully, professional brushes designed for different techniques, graphite pencils ranging from hard to soft leads, and premium sketch pads with paper suitable for multiple mediums. The comprehensive instruction booklet provides step-by-step tutorials for various techniques, from basic sketching to advanced watercolor methods. Students learn fundamental art principles including color theory, composition, and perspective through guided exercises and creative projects. The portable carrying case makes it easy to take artistic inspiration anywhere, whether for outdoor sketching sessions or classroom activities.",
    keyFeatures: [
      "Professional quality materials",
      "Complete starter kit",
      "Instruction booklet",
      "Portable carrying case",
    ],
    stock: 0,
    isAvailable: false,
    get isOutOfStock() {
      return this.stock <= 0 || !this.isAvailable;
    },
    get isLowStock() {
      return this.stock > 0 && this.stock <= 5;
    },
  },
  {
    id: "6",
    name: "History Timeline Book",
    price: 2800,
    discountInPercent: 0,
    rating: 3.8,
    noOfRating: 12,
    category: "History",
    class: "Class 5",
    tag: "Educational",
    imageUrl: "/95443.png",
    description:
      "Journey through time with this comprehensive history book featuring timelines, maps, and engaging stories from different eras.",
    fullDescription:
      "Embark on an extraordinary journey through time with this comprehensive history timeline book designed for Class 5 students. This educational resource transforms the study of history from memorization of dates into an engaging exploration of human civilization and cultural development. Students will discover how past events connect to create the world we know today, developing a deep appreciation for historical continuity and change. The book presents history through multiple lenses - political, social, cultural, and technological - helping students understand that history is not just about kings and wars, but about how ordinary people lived, worked, and contributed to society. Interactive timelines allow students to visualize relationships between events across different regions and time periods. Detailed maps show how geographical factors influenced historical developments and help students understand the spatial dimensions of historical events. Primary source excerpts give students direct access to historical voices and perspectives, while engaging narratives bring historical figures and events to life.",
    keyFeatures: [
      "Chronological timeline",
      "Historical maps",
      "Engaging narratives",
      "Review questions",
    ],
    stock: 6,
    isAvailable: true,
    get isOutOfStock() {
      return this.stock <= 0 || !this.isAvailable;
    },
    get isLowStock() {
      return this.stock > 0 && this.stock <= 5;
    },
  },
];
