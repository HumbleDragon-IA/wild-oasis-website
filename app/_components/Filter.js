"use client";
import Button from "./Button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const buttonsOptions = [
  { filter: "all", textButton: "All cabins" },
  { filter: "small", textButton: "1-3" },
  { filter: "medium", textButton: "4-7" },
  { filter: "large", textButton: "8-12" },
];
function Filter() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const activeFilter = searchParams.get("capacity") ?? "all";
  function handleFilter(filter) {
    const params = new URLSearchParams(searchParams);
    params.set("capacity", filter);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }
  return (
    <div className="border border-primary-800 flex">
      {buttonsOptions.map((button) => (
        <Button
          key={button.filter}
          filter={button.filter}
          handleFilter={handleFilter}
          activeFilter={activeFilter}
        >
          {button.textButton} {button.filter !== "all" ? "guests" : ""}
        </Button>
      ))}
    </div>
  );
}

export default Filter;
