package com.franckie20.resource;

import com.franckie20.entity.UserSettingsEntity;
import com.franckie20.mapper.UserSettingsMapper;
import com.franckie20.model.UserSettings;
import com.franckie20.model.UserSettingsInput;
import com.franckie20.resources.UserSettingsResource;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;

import java.util.UUID;

public class SettingsResource implements UserSettingsResource {
    @Inject
    UserSettingsMapper userSettingsMapper;

    @Override
    public UserSettings getUserSettings(UUID uuid) {
        UserSettingsEntity entity = UserSettingsEntity.findById(uuid.toString());

        if (entity == null) {
            throw new NotFoundException("User settings not found for UUID: " + uuid);
        }

        return userSettingsMapper.toDto(entity);
    }

    @Override
    @Transactional
    public UserSettings saveUserSettings(UUID uuid, UserSettingsInput userSettingsInput) {
        UserSettingsEntity entity = UserSettingsEntity.findById(uuid.toString());
        boolean isNew = false;

        if (entity == null) {
            entity = new UserSettingsEntity();
            entity.uuid = uuid.toString();
            isNew = true;
        }

        // Update database-entity via MapStruct
        entity.name = userSettingsInput.getName();
        entity.wishlistItems = userSettingsMapper.toDbItems(userSettingsInput.getWishlistItems());

        if (isNew) {
            entity.persist();
        }

        return userSettingsMapper.toDto(entity);
    }
}
