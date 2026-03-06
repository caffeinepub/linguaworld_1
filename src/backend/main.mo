import Array "mo:core/Array";
import Iter "mo:core/Iter";
import List "mo:core/List";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Custom Types
  public type Language = {
    id : Text;
    name : Text;
    flag : Text;
    code : Text;
  };

  public type Category = {
    id : Text;
    name : Text;
    languageId : Text;
  };

  public type Flashcard = {
    id : Text;
    categoryId : Text;
    languageId : Text;
    targetWord : Text;
    phonetic : Text;
    translation : Text;
    exampleSentence : Text;
    exampleTranslation : Text;
  };

  public type QuizQuestion = {
    id : Text;
    categoryId : Text;
    languageId : Text;
    flashcardId : Text;
    question : Text;
    options : [Text];
    correctIndex : Nat;
  };

  public type UserProfile = {
    username : Text;
    xp : Nat;
    currentStreak : Nat;
    lastActiveDate : Int;
    badges : [Text];
  };

  public type LanguageProgress = {
    languageId : Text;
    lessonsCompleted : [Text];
    quizScores : [Nat];
    totalXP : Nat;
  };

  public type Highscore = {
    username : Text;
    points : Nat;
  };

  // Saga State
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Data Storage
  let allLanguages = List.fromArray<Language>(
    [
      { id = "1"; name = "Spanish"; flag = "🇪🇸"; code = "es" },
      { id = "2"; name = "French"; flag = "🇫🇷"; code = "fr" },
      { id = "3"; name = "Japanese"; flag = "🇯🇵"; code = "ja" },
      { id = "4"; name = "Mandarin"; flag = "🇨🇳"; code = "zh" },
      { id = "5"; name = "German"; flag = "🇩🇪"; code = "de" },
      { id = "6"; name = "Portuguese"; flag = "🇵🇹"; code = "pt" },
      { id = "7"; name = "Arabic"; flag = "🇸🇦"; code = "ar" },
      { id = "8"; name = "Korean"; flag = "🇰🇷"; code = "ko" },
      { id = "9"; name = "Italian"; flag = "🇮🇹"; code = "it" },
      { id = "10"; name = "Hindi"; flag = "🇮🇳"; code = "hi" },
    ]
  );

  let categories = Map.empty<Text, List.List<Category>>();
  let flashcards = Map.empty<Text, List.List<Flashcard>>();
  let quizQuestions = Map.empty<Text, List.List<QuizQuestion>>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let userProgress = Map.empty<Principal, Map.Map<Text, LanguageProgress>>();

  // Initialize sample data
  private func initSampleData() {
    // Sample categories for Spanish
    let spanishCategories = List.fromArray<Category>([
      { id = "cat1"; name = "Basics"; languageId = "1" },
      { id = "cat2"; name = "Numbers"; languageId = "1" },
      { id = "cat3"; name = "Food"; languageId = "1" },
      { id = "cat4"; name = "Travel"; languageId = "1" },
      { id = "cat5"; name = "Greetings"; languageId = "1" },
      { id = "cat6"; name = "Colors"; languageId = "1" },
    ]);
    categories.add("1", spanishCategories);

    // Sample flashcards for Spanish Basics
    let spanishBasicsFlashcards = List.fromArray<Flashcard>([
      {
        id = "flash1";
        categoryId = "cat1";
        languageId = "1";
        targetWord = "Hola";
        phonetic = "OH-lah";
        translation = "Hello";
        exampleSentence = "Hola, ¿cómo estás?";
        exampleTranslation = "Hello, how are you?";
      },
    ]);
    flashcards.add("1-cat1", spanishBasicsFlashcards);

    // Sample quiz questions
    let spanishBasicsQuiz = List.fromArray<QuizQuestion>([
      {
        id = "quiz1";
        categoryId = "cat1";
        languageId = "1";
        flashcardId = "flash1";
        question = "What does 'Hola' mean?";
        options = ["Goodbye", "Hello", "Thank you", "Please"];
        correctIndex = 1;
      },
    ]);
    quizQuestions.add("1-cat1", spanishBasicsQuiz);
  };

  initSampleData();

  // Helper module for sorting
  module Highscore {
    public func compare(highscore1 : Highscore, highscore2 : Highscore) : Order.Order {
      switch (Nat.compare(highscore2.points, highscore1.points)) {
        case (#equal) { Text.compare(highscore1.username, highscore2.username) };
        case (other) { other };
      };
    };
  };

  // Public query functions (accessible to all including guests)
  public query ({ caller }) func getLanguages() : async [Language] {
    allLanguages.toArray();
  };

  public query ({ caller }) func getCategories(languageId : Text) : async [Category] {
    switch (categories.get(languageId)) {
      case (?cats) { cats.toArray() };
      case null { [] };
    };
  };

  public query ({ caller }) func getFlashcards(languageId : Text, categoryId : Text) : async [Flashcard] {
    let key = languageId # "-" # categoryId;
    switch (flashcards.get(key)) {
      case (?cards) { cards.toArray() };
      case null { [] };
    };
  };

  public query ({ caller }) func getQuizQuestions(languageId : Text, categoryId : Text) : async [QuizQuestion] {
    let key = languageId # "-" # categoryId;
    switch (quizQuestions.get(key)) {
      case (?questions) { questions.toArray() };
      case null { [] };
    };
  };

  public query ({ caller }) func getLeaderboard() : async [Highscore] {
    // Build leaderboard from all user profiles
    let profiles = userProfiles.toArray();
    let scores = profiles.map(
      func((_, profile)) : Highscore {
        { username = profile.username; points = profile.xp };
      }
    );
    let sorted = scores.sort();
    let top10 = sorted.sliceToArray(0, if (sorted.size() < 10) { sorted.size() } else { 10 });
    top10;
  };

  // User profile functions (require user authentication)
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func getOrCreateProfile(username : Text) : async UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create profiles");
    };
    
    switch (userProfiles.get(caller)) {
      case (?profile) { profile };
      case null {
        let newProfile : UserProfile = {
          username = username;
          xp = 0;
          currentStreak = 0;
          lastActiveDate = Time.now();
          badges = [];
        };
        userProfiles.add(caller, newProfile);
        newProfile;
      };
    };
  };

  public query ({ caller }) func getProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public shared ({ caller }) func updateProfile(username : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update profiles");
    };
    
    switch (userProfiles.get(caller)) {
      case (?profile) {
        let updatedProfile : UserProfile = {
          username = username;
          xp = profile.xp;
          currentStreak = profile.currentStreak;
          lastActiveDate = profile.lastActiveDate;
          badges = profile.badges;
        };
        userProfiles.add(caller, updatedProfile);
      };
      case null {
        Runtime.trap("Profile not found. Create a profile first.");
      };
    };
  };

  // Progress tracking functions (require user authentication)
  public shared ({ caller }) func recordFlashcardViewed(languageId : Text, categoryId : Text, flashcardId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can record progress");
    };

    // Get or create user progress map
    let progressMap = switch (userProgress.get(caller)) {
      case (?pm) { pm };
      case null {
        let newMap = Map.empty<Text, LanguageProgress>();
        userProgress.add(caller, newMap);
        newMap;
      };
    };

    // Get or create language progress
    let langProgress = switch (progressMap.get(languageId)) {
      case (?lp) {
        // Check if flashcard already viewed
        let alreadyViewed = lp.lessonsCompleted.find(func(id) { id == flashcardId });
        switch (alreadyViewed) {
          case (?_) { lp }; // Already viewed, no XP
          case null {
            // Add flashcard and award XP
            let newCompleted = lp.lessonsCompleted.concat([flashcardId]);
            {
              languageId = lp.languageId;
              lessonsCompleted = newCompleted;
              quizScores = lp.quizScores;
              totalXP = lp.totalXP + 10;
            };
          };
        };
      };
      case null {
        {
          languageId = languageId;
          lessonsCompleted = [flashcardId];
          quizScores = [];
          totalXP = 10;
        };
      };
    };

    progressMap.add(languageId, langProgress);

    // Update user profile XP
    switch (userProfiles.get(caller)) {
      case (?profile) {
        let updatedProfile : UserProfile = {
          username = profile.username;
          xp = profile.xp + 10;
          currentStreak = profile.currentStreak;
          lastActiveDate = Time.now();
          badges = profile.badges;
        };
        userProfiles.add(caller, updatedProfile);
      };
      case null {};
    };
  };

  public shared ({ caller }) func recordQuizScore(languageId : Text, categoryId : Text, score : Nat, total : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can record quiz scores");
    };

    // Calculate XP based on performance
    let percentage = if (total > 0) { (score * 100) / total } else { 0 };
    let xpEarned = if (percentage >= 80) { 50 } else if (percentage >= 60) { 30 } else { 10 };

    // Get or create user progress map
    let progressMap = switch (userProgress.get(caller)) {
      case (?pm) { pm };
      case null {
        let newMap = Map.empty<Text, LanguageProgress>();
        userProgress.add(caller, newMap);
        newMap;
      };
    };

    // Get or create language progress
    let langProgress = switch (progressMap.get(languageId)) {
      case (?lp) {
        {
          languageId = lp.languageId;
          lessonsCompleted = lp.lessonsCompleted;
          quizScores = lp.quizScores.concat([score]);
          totalXP = lp.totalXP + xpEarned;
        };
      };
      case null {
        {
          languageId = languageId;
          lessonsCompleted = [];
          quizScores = [score];
          totalXP = xpEarned;
        };
      };
    };

    progressMap.add(languageId, langProgress);

    // Update user profile XP
    switch (userProfiles.get(caller)) {
      case (?profile) {
        let updatedProfile : UserProfile = {
          username = profile.username;
          xp = profile.xp + xpEarned;
          currentStreak = profile.currentStreak;
          lastActiveDate = Time.now();
          badges = profile.badges;
        };
        userProfiles.add(caller, updatedProfile);
      };
      case null {};
    };
  };

  public shared ({ caller }) func updateStreak() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update streak");
    };

    switch (userProfiles.get(caller)) {
      case (?profile) {
        let now = Time.now();
        let oneDayNanos : Int = 24 * 60 * 60 * 1_000_000_000;
        let daysSinceLastActive = (now - profile.lastActiveDate) / oneDayNanos;

        let newStreak = if (daysSinceLastActive <= 1) {
          profile.currentStreak + 1;
        } else {
          1;
        };

        let updatedProfile : UserProfile = {
          username = profile.username;
          xp = profile.xp;
          currentStreak = newStreak;
          lastActiveDate = now;
          badges = profile.badges;
        };
        userProfiles.add(caller, updatedProfile);
      };
      case null {
        Runtime.trap("Profile not found");
      };
    };
  };

  public query ({ caller }) func getUserProgress(languageId : Text) : async ?LanguageProgress {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view progress");
    };

    switch (userProgress.get(caller)) {
      case (?progressMap) {
        progressMap.get(languageId);
      };
      case null { null };
    };
  };

  public query ({ caller }) func getAllUserProgress() : async [(Text, LanguageProgress)] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view progress");
    };

    switch (userProgress.get(caller)) {
      case (?progressMap) {
        progressMap.toArray();
      };
      case null { [] };
    };
  };
};
