import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

/**
 * Tai Chi loading animation component
 */
export function TaiChiLoader({ size = 40 }: { size?: number }) {
  return (
    <div
      className="animate-spin"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: "50%",
        background: `conic-gradient(
          hsl(var(--primary)) 0% 50%,
          hsl(var(--background)) 50% 100%
        )`,
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "0",
          left: "50%",
          transform: "translateX(-50%)",
          width: `${size / 2}px`,
          height: `${size / 2}px`,
          borderRadius: "50%",
          background: "hsl(var(--primary))",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "0",
          left: "50%",
          transform: "translateX(-50%)",
          width: `${size / 2}px`,
          height: `${size / 2}px`,
          borderRadius: "50%",
          background: "hsl(var(--background))",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: `${size / 4 - size / 12}px`,
          left: "50%",
          transform: "translateX(-50%)",
          width: `${size / 6}px`,
          height: `${size / 6}px`,
          borderRadius: "50%",
          background: "hsl(var(--background))",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: `${size / 4 - size / 12}px`,
          left: "50%",
          transform: "translateX(-50%)",
          width: `${size / 6}px`,
          height: `${size / 6}px`,
          borderRadius: "50%",
          background: "hsl(var(--primary))",
        }}
      />
    </div>
  );
}

/**
 * Page-level loading skeleton
 */
export function PageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-6 w-1/2" />
      </div>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/3 mb-2" />
          <Skeleton className="h-4 w-2/3" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-1/2" />
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * Name card loading skeleton
 */
export function NameCardSkeleton() {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-4 w-1/3" />
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="text-center space-y-2">
                <Skeleton className="h-8 w-8 mx-auto" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Results section loading skeleton
 */
export function ResultsSkeleton() {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <Skeleton className="h-16 w-1/2 mx-auto" />
            <Skeleton className="h-4 w-1/3 mx-auto" />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-5 w-20 mx-auto" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-10 w-12 mx-auto" />
              <Skeleton className="h-4 w-full mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border rounded-lg p-4 space-y-3">
                <div className="text-center">
                  <Skeleton className="h-12 w-12 mx-auto" />
                  <Skeleton className="h-4 w-20 mx-auto mt-2" />
                </div>
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5].map((j) => (
                    <Skeleton key={j} className="h-4 w-full" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * Inline loading spinner with text
 */
export function LoadingSpinner({ text }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-8">
      <TaiChiLoader size={48} />
      {text && <p className="text-sm text-muted-foreground">{text}</p>}
    </div>
  );
}
