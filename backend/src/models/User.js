/**
 * User Model
 * Represents the structure of a user in the application
 */

export class User {
  constructor({
    uid,
    name,
    email,
    birthDate,
    gender,
    currentWeight,
    height,
    activityLevel = 1,
    dailyCalorieGoal,
    weightGoal,
    role = 'user',
    createdAt,
    updatedAt,
  }) {
    this.uid = uid;
    this.name = name;
    this.email = email;
    this.birthDate = birthDate;
    this.gender = gender;
    this.currentWeight = currentWeight;
    this.height = height;
    this.activityLevel = activityLevel;
    this.dailyCalorieGoal = dailyCalorieGoal;
    this.weightGoal = weightGoal;
    this.role = role;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  /**
   * Convert user to JSON object
   */
  toJSON() {
    return {
      uid: this.uid,
      name: this.name,
      email: this.email,
      birthDate: this.birthDate,
      gender: this.gender,
      currentWeight: this.currentWeight,
      height: this.height,
      activityLevel: this.activityLevel,
      dailyCalorieGoal: this.dailyCalorieGoal,
      weightGoal: this.weightGoal,
      role: this.role,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  /**
   * Check if user has completed onboarding
   */
  isOnboardingComplete() {
    return !!(
      this.birthDate &&
      this.gender &&
      this.currentWeight &&
      this.height &&
      this.weightGoal
    );
  }

  /**
   * Get user's age from birth date
   */
  getAge() {
    if (!this.birthDate) return null;
    const today = new Date();
    const birthDate = new Date(this.birthDate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  }

  /**
   * Calculate BMI (Body Mass Index)
   * BMI = weight (kg) / (height (m))^2
   */
  calculateBMI() {
    if (!this.currentWeight || !this.height) return null;
    const heightInMeters = this.height / 100;
    return (this.currentWeight / (heightInMeters * heightInMeters)).toFixed(2);
  }

  /**
   * Calculate remaining weight to goal
   */
  getRemainingWeightToGoal() {
    if (!this.currentWeight || !this.weightGoal) return null;
    return (this.currentWeight - this.weightGoal).toFixed(2);
  }

  /**
   * Get BMI category
   */
  getBMICategory() {
    const bmi = this.calculateBMI();
    if (!bmi) return null;

    if (bmi < 18.5) return 'Alulsúly';
    if (bmi < 25) return 'Normál súly';
    if (bmi < 30) return 'Túlsúly';
    return 'Elhízás';
  }
}

/**
 * User Validation Schema
 * Used to validate user input
 */
export const userValidationRules = {
  birthDate: (value) => {
    if (!value) return true; // Optional
    const date = new Date(value);
    return !isNaN(date.getTime()) && date < new Date();
  },

  gender: (value) => {
    if (!value) return true; // Optional
    return ['male', 'female', 'other'].includes(value.toLowerCase());
  },

  currentWeight: (value) => {
    if (!value) return true; // Optional
    return value > 0 && value < 500;
  },

  height: (value) => {
    if (!value) return true; // Optional
    return value > 0 && value < 300;
  },

  activityLevel: (value) => {
    if (!value) return true; // Optional
    return value >= 0 && value <= 10;
  },

  dailyCalorieGoal: (value) => {
    if (!value) return true; // Optional
    return value > 0 && value < 10000;
  },

  weightGoal: (value) => {
    if (!value) return true; // Optional
    return value > 0 && value < 500;
  },

  role: (value) => {
    if (!value) return true; // Optional, defaults to 'user'
    return ['user', 'admin'].includes(value.toLowerCase());
  },
};
