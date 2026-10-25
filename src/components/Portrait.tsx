// Flip to true once public/photo.jpg exists.
const HAS_PHOTO = false;

export function Portrait({ label }: { label: string }) {
  return (
    <div className="photo" role="img" aria-label={label}>
      {HAS_PHOTO ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src="/photo.jpg" alt={label} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      ) : (
        <div>
          <span aria-hidden="true">DM</span>
        </div>
      )}
    </div>
  );
}
