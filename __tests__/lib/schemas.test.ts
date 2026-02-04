import { describe, it, expect } from "vitest";
import { postSchema, resultSchema, memberSchema, playlistSchema, albumSchema, eventSchema } from "@/lib/schemas";

describe("Zod Schemas Validation", () => {

  describe("postSchema", () => {
    it("should validate a valid post", () => {
      const validPost = {
        title: "Test Post",
        slug: "test-post",
        excerpt: "This is a test excerpt",
        content: "# Hello World",
        isFeatured: false,
      };
      const result = postSchema.safeParse(validPost);
      expect(result.success).toBe(true);
    });

    it("should fail when required fields are missing", () => {
      const invalidPost = {
        title: "Test Post",
        // slug missing
      };
      const result = postSchema.safeParse(invalidPost);
      expect(result.success).toBe(false);
    });
  });

  describe("resultSchema", () => {
    it("should validate a valid result", () => {
      const validResult = {
        seasonCode: "2024",
        date: "2024-01-01",
        venue: "Pub",
        teamName: "Sysmex",
        placement: 1,
        score: 50,
        memberIds: [],
      };
      const result = resultSchema.safeParse(validResult);
      expect(result.success).toBe(true);
    });

    it("should coerce numeric strings to numbers", () => {
      const validResult = {
        seasonCode: "2024",
        date: "2024-01-01",
        venue: "Pub",
        teamName: "Sysmex",
        placement: "1", // string
        score: "50",    // string
      };
      const result = resultSchema.safeParse(validResult);
      expect(result.success).toBe(true);
      if (result.success) {
          expect(result.data.placement).toBe(1);
          expect(result.data.score).toBe(50);
      }
    });

     it("should fail for invalid placement", () => {
      const invalidResult = {
        seasonCode: "2024",
        date: "2024-01-01",
        venue: "Pub",
        teamName: "Sysmex",
        placement: 0, // min 1
        score: 50,
      };
      const result = resultSchema.safeParse(invalidResult);
      expect(result.success).toBe(false);
    });
  });

  describe("memberSchema", () => {
    it("should validate a valid member", () => {
      const validMember = {
        displayName: "John Doe",
        gender: "M",
      };
      const result = memberSchema.safeParse(validMember);
      expect(result.success).toBe(true);
    });

    it("should fail when display name is missing", () => {
      const invalidMember = {
        gender: "M",
      };
      const result = memberSchema.safeParse(invalidMember);
      expect(result.success).toBe(false);
    });
  });

   describe("playlistSchema", () => {
    it("should validate a valid playlist", () => {
      const validPlaylist = {
        title: "Chill Vibes",
        spotifyUrl: "https://open.spotify.com/playlist/xyz",
        isActive: true,
      };
      const result = playlistSchema.safeParse(validPlaylist);
      expect(result.success).toBe(true);
    });

    it("should fail for invalid URL", () => {
      const invalidPlaylist = {
        title: "Bad URL",
        spotifyUrl: "not-a-url",
      };
      const result = playlistSchema.safeParse(invalidPlaylist);
      expect(result.success).toBe(false);
    });
  });

  describe("albumSchema", () => {
      it("should validate a valid album", () => {
          const validAlbum = {
              title: "Summer 2024",
              dateTaken: "2024-06-01",
              cloudinaryFolder: "summer_2024"
          };
          const result = albumSchema.safeParse(validAlbum);
          expect(result.success).toBe(true);
      })
  })

  describe("eventSchema", () => {
      it("should validate a valid event", () => {
          const validEvent = {
              title: "Next Quiz",
              date: "2024-12-01",
              venue: "Pub X",
              isUpcoming: true
          }
          const result = eventSchema.safeParse(validEvent);
          expect(result.success).toBe(true);
      })
  })

});
