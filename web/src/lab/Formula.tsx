/** Рендерит формулу с нижними индексами: "H2O" → H₂O. */
export function Formula({ f }: { f: string }) {
  return (
    <>
      {[...f].map((ch, i) =>
        /\d/.test(ch) ? <sub key={i}>{ch}</sub> : <span key={i}>{ch}</span>,
      )}
    </>
  );
}
