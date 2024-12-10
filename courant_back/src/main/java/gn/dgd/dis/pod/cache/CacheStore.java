package gn.dgd.dis.pod.cache;

import com.google.common.cache.Cache;
import com.google.common.cache.CacheBuilder;
import jakarta.validation.constraints.NotNull;
import lombok.extern.slf4j.Slf4j;

import java.util.concurrent.TimeUnit;

/**
 * Description : C'est une description standard de EAAD
 *
 * @Author Alpha_Amadou_DIALLO
 * @Version 1.0
 * @Date 28/05/2024
 * @LastModified 28/06/2024
 * @Email dialloalphaamadou947@gmail.com
 * @GitHub: https://github.com/alpha947
 */

@Slf4j
public class CacheStore<K, V> {
    private final Cache<K, V> cache;

    public CacheStore(int expiryDuration, TimeUnit timeUnit) {
        cache = CacheBuilder.newBuilder()
                .expireAfterWrite(expiryDuration, timeUnit)
                .concurrencyLevel(Runtime.getRuntime().availableProcessors())
                .build();
    }

    public V get(@NotNull K key) {
        log.info("Récupération du cache avec clé {}", key.toString());
        return cache.getIfPresent(key);
    }

    public void put(@NotNull K key, @NotNull V value) {
        log.info("Stockage de l'enregistrement dans le cache pour la clé {}", key.toString());
        cache.put(key, value);
    }

    public void evict(@NotNull K key) {
        log.info("Suppression du cache avec la clé {}", key.toString());
        cache.invalidate(key);
    }
}