type HunterClass = "FIGHTER" | "TANKER" | "RANGER"

const ANIMAL_CLASS_MAP: Record<string, {
  requiredClasses: HunterClass[]
  recommendedClass: HunterClass
  reason: string
}> = {
  WOLF:   { 
    requiredClasses: ["FIGHTER", "RANGER"],
    recommendedClass: "FIGHTER", 
    reason: "Wolf is aggressive and fast, FIGHTER is ideal but RANGER can kite" 
  },
  BEAR:   { 
    requiredClasses: ["TANKER"],
    recommendedClass: "TANKER",  
    reason: "Bear has massive HP, only TANKER can absorb its hits" 
  },
  SHARK:  { 
    requiredClasses: ["TANKER", "RANGER"],
    recommendedClass: "TANKER",  
    reason: "Shark is extremely dangerous, TANKER survives longest" 
  },
  BOAR:   { 
    requiredClasses: ["TANKER", "FIGHTER"],
    recommendedClass: "TANKER",  
    reason: "Boar charges hard, TANKER holds the line best" 
  },
  SNAKE:  { 
    requiredClasses: ["RANGER"],
    recommendedClass: "RANGER",  
    reason: "Snake attacks with poison, must keep distance" 
  },
  LIZARD: { 
    requiredClasses: ["RANGER", "FIGHTER"],
    recommendedClass: "RANGER",  
    reason: "Lizard is agile, RANGER can kite effectively" 
  },
  BIRD:   { 
    requiredClasses: ["RANGER"],
    recommendedClass: "RANGER",  
    reason: "Bird attacks from air, only RANGER counters at range" 
  },
  CAT:    { 
    requiredClasses: ["FIGHTER", "RANGER"],
    recommendedClass: "FIGHTER", 
    reason: "Cat is quick and evasive, FIGHTER matches its agility" 
  },
  SPIDER: { 
    requiredClasses: ["RANGER", "TANKER"],
    recommendedClass: "RANGER",  
    reason: "Spider webs and poisons, stay at range" 
  },
  MONKEY: { 
    requiredClasses: ["FIGHTER", "RANGER", "TANKER"],
    recommendedClass: "FIGHTER", 
    reason: "Monkey is unpredictable, all classes can handle it" 
  },
}

export const recommendClass = (animalType: string) => {
  const result = ANIMAL_CLASS_MAP[animalType]
  if (!result) throw new Error("Unknown animal type")
  return result
}