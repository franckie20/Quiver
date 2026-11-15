package com.franckie20.mapper;

import com.franckie20.model.UserSettings;
import com.franckie20.model.WishlistItem;
import com.franckie20.entity.UserSettingsEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import java.util.List;
import java.util.UUID;

@Mapper(componentModel = "jakarta", imports = {UUID.class})
public interface UserSettingsMapper {

    // Zet database String uuid om naar OpenAPI UUID object
    @Mapping(target = "uuid", expression = "java(UUID.fromString(entity.uuid))")
    UserSettings toDto(UserSettingsEntity entity);

    // (Optioneel) Alleen als je een volledige UserSettings object naar entity wilt mappen
    @Mapping(target = "uuid", expression = "java(model.getUuid() != null ? model.getUuid().toString() : null)")
    UserSettingsEntity toEntity(UserSettings model);

    // Let op: toEntity(UserSettingsInput) is hier verwijderd omdat UserSettingsInput geen uuid heeft.

    // Mappings voor wishlist items met quantity
    UserSettingsEntity.DbWishlistItem toDbItem(WishlistItem item);
    WishlistItem toApiModel(UserSettingsEntity.DbWishlistItem dbItem);

    List<UserSettingsEntity.DbWishlistItem> toDbItems(List<WishlistItem> items);
    List<WishlistItem> toApiItems(List<UserSettingsEntity.DbWishlistItem> dbItems);
}