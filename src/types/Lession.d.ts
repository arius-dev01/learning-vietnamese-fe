export interface LessonDTO {
  id: number;
  title: string;
  describe: string;
  content: string;
  vocabularies: VocabularyDTO[];
  time: string;
  video_url: string;
  level: string;
  created: string;
  gameCount: number;
  typeGames: string[];
  progress: number;
  titleJa?: string;
  describeJa?: string;
  contentJa?: string;
  totalUser?: number;
  countCompleted?: number;
  updated: string;
}

interface VocabularyDTO {
  id: number;
  word: string;
  meaning: string;
  meaningJa: string;
  pronunciation: string;
  lessonId: number;
  lesson: string;
}
