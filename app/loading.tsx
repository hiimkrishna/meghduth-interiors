import Skeleton from "@/components/ui/Skeleton";
import Container from "@/components/ui/Container";

export default function Loading() {
  return (
    <main className="pt-28 pb-20">
      <Container>
        <Skeleton className="h-[46vh] w-full rounded-3xl" />
        <Skeleton className="mx-auto mt-10 h-10 w-2/3" />
        <Skeleton className="mx-auto mt-4 h-5 w-full max-w-2xl" />
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          <Skeleton className="h-72" />
          <Skeleton className="h-72" />
        </div>
      </Container>
    </main>
  );
}