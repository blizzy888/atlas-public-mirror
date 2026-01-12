import type { UserProfile, Supplement } from "@/types";

export interface PresetData {
  name: string;
  description: string;
  profile: UserProfile;
  supplements: Omit<Supplement, "id" | "createdAt">[];
}

export const PRESET_DATA: PresetData[] = [
  {
    name: "Fitness Enthusiast",
    description: "Active person focused on muscle building and performance optimization",
    profile: {
      name: "Alex Johnson",
      age: "28",
      gender: "Male",
      weight: "175",
      healthGoals:
        "Build lean muscle mass, improve workout performance, enhance recovery time, increase strength and endurance",
      medicalConditions: "",
      currentMedications: "",
      allergies: "",
    },
    supplements: [
      {
        name: "Whey Protein Isolate",
        dosage: "30g",
        frequency: "Daily",
        timing: "Post-workout",
      },
      {
        name: "Creatine Monohydrate",
        dosage: "5g",
        frequency: "Daily",
        timing: "Pre or post-workout",
      },
      {
        name: "Beta-Alanine",
        dosage: "3g",
        frequency: "Daily",
        timing: "Pre-workout",
      },
      {
        name: "Citrulline Malate",
        dosage: "6g",
        frequency: "Daily",
        timing: "30 min before workout",
      },
      {
        name: "Vitamin D3",
        dosage: "4000 IU",
        frequency: "Daily",
        timing: "With breakfast",
      },
      {
        name: "Omega-3 Fish Oil",
        dosage: "2g EPA/DHA",
        frequency: "Daily",
        timing: "With dinner",
      },
      {
        name: "Magnesium Glycinate",
        dosage: "400mg",
        frequency: "Daily",
        timing: "Before bed",
      },
    ],
  },
  {
    name: "General Wellness",
    description: "Balanced approach for everyday health, energy, and immune support",
    profile: {
      name: "Sarah Chen",
      age: "35",
      gender: "Female",
      weight: "140",
      healthGoals:
        "Increase daily energy levels, strengthen immune system, improve sleep quality, reduce stress, maintain overall health",
      medicalConditions: "",
      currentMedications: "",
      allergies: "",
    },
    supplements: [
      {
        name: "High-Quality Multivitamin",
        dosage: "1 tablet",
        frequency: "Daily",
        timing: "With breakfast",
      },
      {
        name: "Vitamin D3 + K2",
        dosage: "2000 IU + 100mcg",
        frequency: "Daily",
        timing: "With breakfast",
      },
      {
        name: "Omega-3 Fish Oil",
        dosage: "1000mg EPA/DHA",
        frequency: "Daily",
        timing: "With dinner",
      },
      {
        name: "Probiotics",
        dosage: "50 billion CFU",
        frequency: "Daily",
        timing: "With breakfast",
      },
      {
        name: "Ashwagandha",
        dosage: "300mg",
        frequency: "Daily",
        timing: "Evening with food",
      },
      {
        name: "Magnesium Bisglycinate",
        dosage: "200mg",
        frequency: "Daily",
        timing: "Before bed",
      },
      {
        name: "B-Complex",
        dosage: "1 capsule",
        frequency: "Daily",
        timing: "Morning with breakfast",
      },
    ],
  },
  {
    name: "Healthy Aging",
    description:
      "Comprehensive support for bone health, cognitive function, and cardiovascular wellness",
    profile: {
      name: "Robert Davis",
      age: "58",
      gender: "Male",
      weight: "180",
      healthGoals:
        "Maintain strong bones and joints, support heart health, preserve cognitive function, manage cholesterol levels naturally",
      medicalConditions: "High cholesterol, mild joint stiffness",
      currentMedications: "Atorvastatin 20mg daily",
      allergies: "",
    },
    supplements: [
      {
        name: "Calcium Citrate + Vitamin D3",
        dosage: "600mg + 1000 IU",
        frequency: "Daily",
        timing: "With dinner",
      },
      {
        name: "Coenzyme Q10 (Ubiquinol)",
        dosage: "200mg",
        frequency: "Daily",
        timing: "With breakfast",
      },
      {
        name: "High-EPA Fish Oil",
        dosage: "2000mg EPA/DHA",
        frequency: "Daily",
        timing: "With lunch",
      },
      {
        name: "Turmeric + Black Pepper",
        dosage: "500mg + 5mg",
        frequency: "Daily",
        timing: "With food",
      },
      {
        name: "Glucosamine + Chondroitin",
        dosage: "1500mg + 1200mg",
        frequency: "Daily",
        timing: "With breakfast",
      },
      {
        name: "Magnesium Threonate",
        dosage: "144mg",
        frequency: "Daily",
        timing: "Before bed",
      },
      {
        name: "Lion's Mane Mushroom",
        dosage: "500mg",
        frequency: "Daily",
        timing: "Morning",
      },
      {
        name: "Red Yeast Rice",
        dosage: "600mg",
        frequency: "Daily",
        timing: "With dinner",
      },
    ],
  },
];
