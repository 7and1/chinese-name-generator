
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { locales } from "@/i18n";
import { SAMPLE_CHARACTERS } from "@/lib/data/characters";
import { CHINESE_SURNAMES } from "@/lib/data/surnames";
import { generateCharacterMetadata } from "@/lib/seo/character-metadata";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface CharacterPageProps {
  params: Promise<{
    locale: string;
    char: string;
  }>;
}

export async function generateStaticParams() {
  const topChars = SAMPLE_CHARACTERS.slice(0, 1000);

  return locales.flatMap((locale) =>
    topChars.map((char) => ({
      locale,
      char: char.char,
    })),
  );
}

export async function generateMetadata({ params }: CharacterPageProps) {
  const { locale, char } = await params;
  setRequestLocale(locale);

  const charInfo = SAMPLE_CHARACTERS.find((c) => c.char === char);

  if (!charInfo) {
    return {
      title: "Character Not Found",
    };
  }

  return generateCharacterMetadata({
    locale,
    char: charInfo.char,
    pinyin: charInfo.pinyin,
    meaning: charInfo.meaning,
    fiveElement: charInfo.fiveElement,
  });
}

export default async function CharacterPage({ params }: CharacterPageProps) {
  const { locale, char } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("characters");

  const charInfo = SAMPLE_CHARACTERS.find((c) => c.char === char);

  if (!charInfo) {
    notFound();
  }

  // Find related surnames (top 10 by frequency)
  const relatedSurnames = CHINESE_SURNAMES.slice(0, 10);

  // Find related characters with same element
  const relatedCharacters = SAMPLE_CHARACTERS.filter(
    (c) => c.fiveElement === charInfo.fiveElement && c.char !== char,
  ).slice(0, 20);

  // Generate name suggestions
  const nameSuggestions = CHINESE_SURNAMES.slice(0, 20).map((surname) => ({
    surname: surname.surname,
    fullName: `${surname.surname}${char}`,
  }));

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm">
        <ol className="flex items-center space-x-2">
          <li>
            <Link href={`/${locale}`} className="text-primary hover:underline">
              Home
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link
              href={`/${locale}/characters`}
              className="text-primary hover:underline"
            >
              Characters
            </Link>
          </li>
          <li>/</li>
          <li className="text-muted-foreground">{char}</li>
        </ol>
      </nav>

      {/* Main Character Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-5xl font-bold">{char}</CardTitle>
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  {charInfo.fiveElement}
                </Badge>
              </div>
              <p className="text-2xl text-muted-foreground">
                {charInfo.pinyin}
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Meaning</h3>
                <p className="text-base">{charInfo.meaning}</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Stroke Count</p>
                  <p className="text-xl font-semibold">
                    {charInfo.strokeCount}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Kangxi Strokes
                  </p>
                  <p className="text-xl font-semibold">
                    {charInfo.kangxiStrokeCount}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Radical</p>
                  <p className="text-xl font-semibold">{charInfo.radical}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tone</p>
                  <p className="text-xl font-semibold">{charInfo.tone}</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Five Elements</h3>
                <p className="text-base">
                  This character belongs to the{" "}
                  <Badge variant="outline">{charInfo.fiveElement}</Badge>{" "}
                  element, which is important for BaZi analysis and creating
                  balanced names.
                </p>
              </div>

              <div className="flex gap-4">
                <Button asChild>
                  <Link href={`/${locale}/generate?char=${char}`}>
                    Generate Names with {char}
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href={`/${locale}/analyze?char=${char}`}>
                    Analyze {char}
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Character Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Frequency</span>
                <span className="font-medium">
                  {charInfo.frequency ? `#${charInfo.frequency}` : "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">HSK Level</span>
                <span className="font-medium">
                  {charInfo.hskLevel || "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tone</span>
                <span className="font-medium">{charInfo.tone}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Five Elements Info</CardTitle>
            </CardHeader>
            <CardContent>
              <Link
                href={`/${locale}/elements/${charInfo.fiveElement}`}
                className="text-primary hover:underline"
              >
                <Button variant="outline" className="w-full">
                  View {charInfo.fiveElement} Element Names
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Name Suggestions */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Name Suggestions with {char}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {nameSuggestions.map((name) => (
              <Link
                key={name.fullName}
                href={`/${locale}/generate?surname=${name.surname}&char=${char}`}
                className="block"
              >
                <div className="p-3 border rounded-lg hover:bg-accent transition-colors text-center">
                  <p className="font-medium">{name.fullName}</p>
                  <p className="text-sm text-muted-foreground">
                    {name.surname}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Related Characters */}
      {relatedCharacters.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>
              Related {charInfo.fiveElement} Element Characters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 md:grid-cols-10 gap-3">
              {relatedCharacters.map((relatedChar) => (
                <Link
                  key={relatedChar.char}
                  href={`/${locale}/characters/${relatedChar.char}`}
                  className="block"
                >
                  <div className="p-3 border rounded-lg hover:bg-accent transition-colors text-center">
                    <p className="text-2xl font-bold">{relatedChar.char}</p>
                    <p className="text-xs text-muted-foreground">
                      {relatedChar.pinyin}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Related Surnames */}
      {relatedSurnames.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Popular Surnames</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {relatedSurnames.map((surname) => (
                <Link
                  key={surname.surname}
                  href={`/${locale}/surnames/${surname.surname}`}
                  className="block"
                >
                  <div className="p-3 border rounded-lg hover:bg-accent transition-colors text-center">
                    <p className="text-xl font-bold">{surname.surname}</p>
                    <p className="text-sm text-muted-foreground">
                      {surname.pinyin}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
