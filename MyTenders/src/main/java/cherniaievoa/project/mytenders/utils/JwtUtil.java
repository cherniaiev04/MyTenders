package cherniaievoa.project.mytenders.utils;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {
  @Value("${jwt.secret}")
  private String jwtSecret;

  @Value("${jwt.expiration}")
  private int jwtExpirationMs;

  // private Key key;
  // Initializes the key after the class is instantiated and the jwtSecret is injected,
  // preventing the repeated creation of the key and enhancing performance
//  @PostConstruct
//  public void init() {
//    if (jwtSecret == null || jwtSecret.isEmpty()) {
//      throw new IllegalArgumentException("JWT secret must not be null or empty");
//    }
//    this.key = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
//  }

  private Key getSignInKey() {
    return Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
  }

  // Generate JWT token
  public String generateToken(String username, String role) {
    return Jwts.builder()
            .setSubject(username)
            .claim("role", role)
            .setIssuedAt(new Date())
            .setExpiration(new Date((new Date()).getTime() + jwtExpirationMs))
            .signWith(SignatureAlgorithm.HS256, getSignInKey())
            .compact();
  }

  // Get username from JWT token
  public String getUsernameFromToken(String token) {
    return Jwts.parser()
            .setSigningKey(getSignInKey())
            .parseClaimsJws(token)
            .getBody()
            .getSubject();
  }
  // Validate JWT token
  public boolean validateJwtToken(String token) {
    try {
      Jwts.parser().setSigningKey(getSignInKey())
              .parseClaimsJws(token);
      return true;
    } catch (SecurityException e) {
      System.out.println("Invalid JWT signature: " + e.getMessage());
    } catch (MalformedJwtException e) {
      System.out.println("Invalid JWT token: " + e.getMessage());
    } catch (ExpiredJwtException e) {
      System.out.println("JWT token is expired: " + e.getMessage());
    } catch (UnsupportedJwtException e) {
      System.out.println("JWT token is unsupported: " + e.getMessage());
    } catch (IllegalArgumentException e) {
      System.out.println("JWT claims string is empty: " + e.getMessage());
    }
    return false;
  }
}
