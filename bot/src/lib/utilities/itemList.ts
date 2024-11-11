export const ItemList: ItemList = {
	entropy: {
		'amino-acid': { price: 15 },
		dna: { price: 100 },
		'prokaryotic-cell': { price: 600 },
		'eukaryotic-cell': { price: 3000 },
		sponge: { price: 10000 },
		jellyfish: { price: 40000 },
		flatworm: { price: 200000 },
		fish: { price: 1.95e6 },
		tetrapod: { price: 1.59e7 },
		mammal: { price: 3.58e8 },
		turtles: { price: 2.7e9 },
		ape: { price: 1.12e10 },
		glires: { price: 9.1e10 },
		crocodilia: { price: 8.05e12 },
		human: { price: 8.87e12 },
		ungulates: { price: 4.42e13 },
		cyborg: { price: 1.47e15 },
		marsupials: { price: 9.5e15 },
		lizard: { price: 8.32e16 },
		superhuman: { price: 7.67e17 },
		snake: { price: 6.66e18 },
		galliformes: { price: 4.45e19 },
		'humanoid-colonist': { price: 1.32e20 },
		anseriformes: { price: 9.2e20 },
		caniform: { price: 7.89e21 },
		paleognathae: { price: 2.54e22 },
		neoaves: { price: 6.67e23 },
		cetaceans: { price: 7.2e24 },
		monotremes: { price: 4.0e26 },
		feliform: { price: 4.76e29 }
	},
	ideas: {
		'stone-age': { price: 46 },
		'neolithic-age': { price: 460 },
		'bronze-age': { price: 1380 },
		'iron-age': { price: 6900 },
		'middle-age': { price: 23000 },
		'age-of-discovery': { price: 138000 },
		'scientific-revolution': { price: 575000 },
		'industrial-revolution': { price: 3.83e6 },
		'atomic-age': { price: 28.395e7 },
		'information-age': { price: 9.2e9 },
		'emergent-age': { price: 1.725e11 },
		singularity: { price: 9.82e12 },
		rover: { price: 1.227e13 },
		android: { price: 10.162e16 },
		'human-expedition': { price: 9.25e17 },
		'sentient-android': { price: 1.32e18 },
		'martian-settlement': { price: 1.056e22 },
		'martian-factory': { price: 4.76e24 },
		'martian-city': { price: 4.4e27 }
	},
	fossils: {
		archosaur: { price: 3.74 },
		ornithischia: { price: 60 },
		stegosaurus: { price: 720 },
		ankylosaurus: { price: 8640 },
		triceratops: { price: 103680 },
		pterosaur: { price: 1240000 },
		plesiosaur: { price: 14930000 },
		saurischia: { price: 179160000 },
		sauropoda: { price: 2150000000 },
		theropoda: { price: 25800000000 },
		compsognathus: { price: 309580000000 },
		velociraptor: { price: 3720000000000 },
		pachycephalosaurus: { price: 44580000000000 },
		gallimimus: { price: 534970000000000 },
		archaeopteryx: { price: 6420000000000000 },
		brachiosaurus: { price: 77040000000000000n },
		'tyrannosaurus-rex': { price: 924420000000000000n },
		spinosaurus: { price: 11090000000000000000n },
		iguanodon: { price: 133120000000000000000n },
		ichthyosaur: { price: 1.6e21 },
		cynodont: { price: 1.917e22 },
		eoraptor: { price: 2.3002e23 },
		mosasaurus: { price: 2.76e24 },
		argentinosaurus: { price: 3.312e25 },
		giganotosaurus: { price: 3.975e26 }
	}
};

export interface ItemList {
	entropy: Record<string, ItemDefinitions>;
	ideas: Record<string, ItemDefinitions>;
	fossils: Record<string, ItemDefinitions>;
}

export interface ItemDefinitions {
	price: number | bigint;
}
