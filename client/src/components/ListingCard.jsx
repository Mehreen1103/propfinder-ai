import { formatBDT, titleCase } from '../utils/format.js';

export default function ListingCard({ listing }) {
  const { title, city, area, propertyType, bedrooms, bathrooms, sizeSqft, price, features, description } =
    listing;
  const hasRooms = bedrooms > 0;

  return (
    <article className="card">
      <div className={`card__band card__band--${propertyType}`}>
        <span className="card__type">{titleCase(propertyType)}</span>
        <span className="card__price">BDT {formatBDT(price)}</span>
      </div>
      <div className="card__body">
        <h3 className="card__title">{title}</h3>
        <p className="card__loc">
          {area}, {city}
        </p>
        <ul className="card__specs">
          {hasRooms && <li>{bedrooms} bed</li>}
          {hasRooms && <li>{bathrooms} bath</li>}
          <li>{sizeSqft.toLocaleString('en-US')} sqft</li>
        </ul>
        <p className="card__desc">{description}</p>
        {features.length > 0 && (
          <ul className="card__tags">
            {features.map((f) => (
              <li key={f}>{titleCase(f)}</li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}
