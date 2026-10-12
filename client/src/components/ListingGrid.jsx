import ListingCard from './ListingCard.jsx';

export default function ListingGrid({ listings }) {
  return (
    <div className="grid">
      {listings.map((l) => (
        <ListingCard key={l.id} listing={l} />
      ))}
    </div>
  );
}
